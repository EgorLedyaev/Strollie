import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type { Trip } from './trip.model';

// Хранит все поездки пользователя
export const tripsAtom = atomWithStorage<Trip[]>('trips', []);

// Текущая выбранная поездка (для просмотра/редактирования)
export const currentTripAtom = atom<Trip | null>(null);
