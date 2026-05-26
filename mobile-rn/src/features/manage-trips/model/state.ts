import { atom } from 'jotai';

import { Ticket } from '@/entities/ticket';
import type { TripChecklistItem } from '@/entities/trip';

export const startDateAtom = atom<string>('');
export const endDateAtom = atom<string>('');
export const notesAtom = atom<string>('');
export const ticketIdsAtom = atom<string[]>([]);
export const placesAtom = atom<string[]>([]);
export const routesAtom = atom<string[]>([]);
export const checklistAtom = atom<TripChecklistItem[]>([]);
export const isSubmittingAtom = atom(false);

export const selectedTicketsAtom = atom<Ticket[]>([]);
export const editingTripTicketsAtom = atom<Ticket[] | null>(null);
