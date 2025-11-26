import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatISO } from 'date-fns';
import { getDefaultStore } from 'jotai';

import type { Ticket } from '../model';
import {
	baseTicketsAtom,
	hydrateTicketsAtom,
	setTicketsAtom,
	ticketsHydratedAtom,
} from '../model/ticket.state';

// Используем ESM совместимый mock без require()
jest.mock('@react-native-async-storage/async-storage', () => {
	const mock = {
		__esModule: true,
		default: new (class MemoryStorage {
			private store: Record<string, string> = {};
			async getItem(key: string) {
				return this.store[key] ?? null;
			}
			async setItem(key: string, value: string) {
				this.store[key] = value;
			}
			async removeItem(key: string) {
				delete this.store[key];
			}
			async clear() {
				this.store = {};
			}
		})(),
	};
	return mock;
});

function sampleTicket(id: string): Ticket {
	return {
		id,
		from: 'A',
		to: 'B',
		departureTime: formatISO(new Date()),
		arrivalTime: formatISO(new Date()),
		isUsed: false,
		type: 'train',
		businessCategory: 'transport',
		title: id,
	} as Ticket;
}

describe('tickets hydration atoms', () => {
	it('hydrates from AsyncStorage once', async () => {
		const t1 = sampleTicket('t1');
		await AsyncStorage.setItem('tickets', JSON.stringify([t1]));

		const store = getDefaultStore();
		await store.set(hydrateTicketsAtom);

		expect(store.get(ticketsHydratedAtom)).toBe(true);
		expect(store.get(baseTicketsAtom)).toHaveLength(1);

		// Повторный вызов не меняет ссылку и не перечитывает
		const before = store.get(baseTicketsAtom);
		await store.set(hydrateTicketsAtom);
		const after = store.get(baseTicketsAtom);
		expect(after).toBe(before);
	});

	it('setTickets persists to AsyncStorage', async () => {
		const store = getDefaultStore();
		const t2 = sampleTicket('t2');
		await store.set(setTicketsAtom, () => [t2]);
		const raw = await AsyncStorage.getItem('tickets');
		expect(raw).toContain('t2');
	});
});
