import { useAtom } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';

import { DEFAULT_TTL_MS, ticketApi } from '../api/ticketApi';
import { mergeTicketLists } from '../lib/mergeTicketLists';
import type { Ticket } from './ticket.model';
// Avoid barrel import to prevent require cycle (index.ts -> useTicketsSWR.ts -> index.ts)
import {
	hydrateTicketsAtom,
	setTicketsAtom,
	ticketsAtom,
	ticketsHydratedAtom,
} from './ticket.state';

interface UseTicketsSWROptions {
	ttlMs?: number;
	/** Принудительный форс апдейт (игнор TTL) */
	force?: boolean;
	/** Автообновление в фоне по интервалу (ms). 0/undefined = выкл */
	refreshIntervalMs?: number;
}

interface UseTicketsSWRResult {
	tickets: Ticket[];
	isHydrated: boolean;
	isLoading: boolean; // true когда нет данных и идёт первичная загрузка
	isRefreshing: boolean; // фоновые обновления при наличии snapshot
	error: Error | null;
	forceRefresh: () => Promise<void>;
}

/**
 * Универсальный хук для получения билетов с SWR-паттерном.
 * Возвращает snapshot мгновенно, триггерит фоновый refresh если устарело.
 */
export function useTicketsSWR(
	opts: UseTicketsSWROptions = {},
): UseTicketsSWRResult {
	const { ttlMs = DEFAULT_TTL_MS, force = false, refreshIntervalMs } = opts;
	const [tickets] = useAtom<Ticket[]>(ticketsAtom);
	const [hydrated] = useAtom(ticketsHydratedAtom);
	const [, hydrate] = useAtom(hydrateTicketsAtom);
	const [, setTickets] = useAtom(setTicketsAtom);
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const runningRef = useRef(false);

	// Первичная гидратация
	useEffect(() => {
		hydrate();
	}, [hydrate]);

	const mergeApply = useCallback(
		(incoming: Ticket[]) => {
			setTickets(prev => mergeTicketLists(prev, incoming));
		},
		[setTickets],
	);

	const doBlockingFetch = useCallback(async () => {
		runningRef.current = true;
		setIsLoading(true);
		setError(null);
		try {
			const data = await ticketApi.getMyTickets({ force, ttlMs });
			mergeApply(data);
		} catch (e) {
			setError(e instanceof Error ? e : new Error('unknown'));
		} finally {
			setIsLoading(false);
			runningRef.current = false;
		}
	}, [force, ttlMs, mergeApply]);

	const doSWRFetch = useCallback(async () => {
		// если нет snapshot или force — делаем блокирующий
		if (!hydrated || tickets.length === 0 || force) {
			await doBlockingFetch();
			return;
		}
		setIsRefreshing(true);
		setError(null);
		try {
			await ticketApi.getMyTicketsSWR({
				ttlMs,
				onUpdate: fresh => mergeApply(fresh),
			});
		} catch (e) {
			setError(e instanceof Error ? e : new Error('unknown'));
		} finally {
			setIsRefreshing(false);
		}
	}, [hydrated, tickets.length, force, ttlMs, mergeApply, doBlockingFetch]);

	// Первичная загрузка после гидратации
	useEffect(() => {
		if (!hydrated) return;
		if (runningRef.current) return;
		if (tickets.length === 0) void doBlockingFetch();
		else void doSWRFetch();
	}, [hydrated, tickets.length, doBlockingFetch, doSWRFetch]);

	// Refresh interval
	useEffect(() => {
		if (!refreshIntervalMs) return;
		if (!hydrated) return;
		if (intervalRef.current) clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			void doSWRFetch();
		}, refreshIntervalMs);
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [refreshIntervalMs, hydrated, doSWRFetch]);

	const forceRefresh = useCallback(async () => {
		await doBlockingFetch();
	}, [doBlockingFetch]);

	return {
		tickets,
		isHydrated: hydrated,
		isLoading: !hydrated || isLoading,
		isRefreshing,
		error,
		forceRefresh,
	};
}
