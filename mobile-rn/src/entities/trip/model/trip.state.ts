import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';

import type { Trip } from './trip.model';

const STORAGE_KEY = 'trips';

export const baseTripsAtom = atom<Trip[]>([]);

export const tripsHydratedAtom = atom<boolean>(false);

export const tripsAtom = atom(get => get(baseTripsAtom));

export const setTripsAtom = atom(
	null,
	async (get, set, updater: (prev: Trip[]) => Trip[] | Trip[]) => {
		const prev = get(baseTripsAtom);
		const next =
			typeof updater === 'function'
				? (updater as (p: Trip[]) => Trip[])(prev)
				: (updater as Trip[]);

		set(baseTripsAtom, next);
		AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(err => {
			console.error('Failed to persist trips:', err);
		});
	},
);

export const hydrateTripsAtom = atom(null, async (get, set) => {
	if (get(tripsHydratedAtom)) return; // уже
	try {
		const raw = await AsyncStorage.getItem(STORAGE_KEY);
		if (raw) {
			try {
				const parsed: Trip[] = JSON.parse(raw);
				set(baseTripsAtom, parsed);
			} catch {
				/* ignore JSON parse error */
			}
		}
	} finally {
		set(tripsHydratedAtom, true);
	}
});

export const currentTripAtom = atom<Trip | null>(null);
