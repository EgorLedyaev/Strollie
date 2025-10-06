import { useAtom } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';

import { DEFAULT_TTL_MS, tripApi } from '../api/tripApi';
import { mergeTripLists } from '../lib/mergeTripLists';
import type { Trip } from './trip.model';
import {
	hydrateTripsAtom,
	setTripsAtom,
	tripsAtom,
	tripsHydratedAtom,
} from './trip.state';

interface UseTripsSWROptions {
	ttlMs?: number;
	force?: boolean;
	refreshIntervalMs?: number;
}

interface UseTripsSWRResult {
	trips: Trip[];
	isHydrated: boolean;
	isLoading: boolean;
	isRefreshing: boolean;
	error: Error | null;
	forceRefresh: () => Promise<void>;
}

export function useTripsSWR(opts: UseTripsSWROptions = {}): UseTripsSWRResult {
	const { ttlMs = DEFAULT_TTL_MS, force = false, refreshIntervalMs } = opts;
	const [trips] = useAtom<Trip[]>(tripsAtom);
	const [hydrated] = useAtom(tripsHydratedAtom);
	const [, hydrate] = useAtom(hydrateTripsAtom);
	const [, setTrips] = useAtom(setTripsAtom);
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const runningRef = useRef(false); // Защита от гонок состояний

	useEffect(() => {
		hydrate();
	}, [hydrate]);

	const mergeApply = useCallback(
		(incoming: Trip[]) => {
			setTrips(prev => mergeTripLists(prev, incoming));
		},
		[setTrips],
	);

	const doBlockingFetch = useCallback(async () => {
		// if (runningRef.current) return;
		runningRef.current = true;
		setIsLoading(true);
		setError(null);
		try {
			const data = await tripApi.getMyTrips({ force, ttlMs });
			mergeApply(data);
		} catch (e) {
			setError(e instanceof Error ? e : new Error('Unknown fetch error'));
		} finally {
			setIsLoading(false);
			runningRef.current = false;
		}
	}, [force, ttlMs, mergeApply]);

	// const doSWRFetch = useCallback(async () => {
	// 	if (runningRef.current) return;
	// 	if (!hydrated || trips.length === 0 || force) {
	// 		await doBlockingFetch();
	// 		return;
	// 	}
	//
	// 	runningRef.current = true;
	// 	setIsRefreshing(true);
	// 	setError(null);
	// 	try {
	// 		// SWR-метод не возвращает данные напрямую, а вызывает коллбэк
	// 		await tripApi.getMyTripsSWR({
	// 			ttlMs,
	// 			onUpdate: fresh => mergeApply(fresh),
	// 		});
	// 	} catch (e) {
	// 		setError(e instanceof Error ? e : new Error('Unknown SWR error'));
	// 	} finally {
	// 		setIsRefreshing(false);
	// 		runningRef.current = false;
	// 	}
	// }, [hydrated, trips.length, force, ttlMs, mergeApply, doBlockingFetch]);
	const doSWRFetch = useCallback(async () => {
		// Эта функция вызывается только когда данные уже есть,
		// поэтому проверка на trips.length === 0 не нужна.
		// Ее делает useEffect.

		runningRef.current = true;
		setIsRefreshing(true);
		setError(null);
		try {
			await tripApi.getMyTripsSWR({
				ttlMs,
				onUpdate: fresh => mergeApply(fresh),
			});
		} catch (e) {
			setError(e instanceof Error ? e : new Error('Unknown SWR error'));
		} finally {
			setIsRefreshing(false);
			runningRef.current = false;
		}
	}, [force, ttlMs, mergeApply]);
	// useEffect(() => {
	// 	if (!hydrated || runningRef.current) return;
	// 	void doSWRFetch();
	// }, [hydrated, doSWRFetch]);

	useEffect(() => {
		if (!hydrated || runningRef.current) return;
		if (trips.length === 0) {
			void doBlockingFetch();
		} else {
			void doSWRFetch();
		}
	}, [hydrated, trips.length, doBlockingFetch, doSWRFetch]);

	useEffect(() => {
		if (!refreshIntervalMs || !hydrated) return;

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
		trips,
		isHydrated: hydrated,
		isLoading: !hydrated || isLoading,
		isRefreshing,
		error,
		forceRefresh,
	};
}
