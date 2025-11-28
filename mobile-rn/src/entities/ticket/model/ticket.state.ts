import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';

import type { Ticket } from './ticket.model';

// Текущий выбранный билет (для просмотра деталей)
export const currentTicketAtom = atom<Ticket | null>(null);

export const baseTicketsAtom = atom<Ticket[]>([]);
export const ticketsHydratedAtom = atom(false);

export const hydrateTicketsAtom = atom(null, async (get, set) => {
	if (get(ticketsHydratedAtom)) return;
	try {
		const json = await AsyncStorage.getItem('tickets');
		if (json) {
			set(baseTicketsAtom, JSON.parse(json));
		}
	} catch (e) {
		console.error('Failed to hydrate tickets', e);
	} finally {
		set(ticketsHydratedAtom, true);
	}
});

export const setTicketsAtom = atom(
	null,
	async (get, set, update: (prev: Ticket[]) => Ticket[]) => {
		const prev = get(baseTicketsAtom);
		const next = update(prev);
		set(baseTicketsAtom, next);
		await AsyncStorage.setItem('tickets', JSON.stringify(next));
	},
);
