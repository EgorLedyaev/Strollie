import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';

import type { Ticket } from './ticket.model';

const STORAGE_KEY = 'tickets';

// Базовый список билетов в памяти (гидрируется вручную)
export const baseTicketsAtom = atom<Ticket[]>([]);

// Флаг завершения гидратации
export const ticketsHydratedAtom = atom<boolean>(false);

// Публичный читаемый атом билетов
export const ticketsAtom = atom(get => get(baseTicketsAtom));

// Write-only: установить билеты (и сразу запланировать persist)
export const setTicketsAtom = atom(
	null,
	async (get, set, updater: (prev: Ticket[]) => Ticket[] | Ticket[]) => {
		const prev = get(baseTicketsAtom);
		const next =
			typeof updater === 'function'
				? (updater as (p: Ticket[]) => Ticket[])(prev)
				: (updater as Ticket[]);
		set(baseTicketsAtom, next);
		// persist (fire & forget)
		AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
	},
);

// Write-only: гидратация из AsyncStorage (если уже не сделана)
export const hydrateTicketsAtom = atom(null, async (get, set) => {
	if (get(ticketsHydratedAtom)) return; // уже
	try {
		const raw = await AsyncStorage.getItem(STORAGE_KEY);
		if (raw) {
			try {
				const parsed: Ticket[] = JSON.parse(raw);
				set(baseTicketsAtom, parsed);
			} catch {
				/* ignore JSON parse error */
			}
		}
	} finally {
		set(ticketsHydratedAtom, true);
	}
});

// Текущий выбранный билет (для просмотра деталей)
export const currentTicketAtom = atom<Ticket | null>(null);
