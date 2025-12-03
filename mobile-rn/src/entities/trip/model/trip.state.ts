import { atom } from 'jotai';

import type { Trip } from './trip.model';

/**
 * Currently selected trip for viewing/editing.
 * Pure UI state — server data is managed by React Query.
 */
export const currentTripAtom = atom<Trip | null>(null);
