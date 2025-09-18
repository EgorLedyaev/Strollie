import { atom } from 'jotai';
import type { TicketBusinessCategory } from './ticket.model';

// Локальные атомы формы добавления билета
export const newTicketTitleAtom = atom<string>('');
export const newTicketDateAtom = atom<string>(''); // ISO date (без времени) или полный ISO
export const newTicketImageAtom = atom<string | null>(null); // локальный URI изображения
export const newTicketImageFileNameAtom = atom<string | null>(null);
export const newTicketCategoryAtom = atom<TicketBusinessCategory | null>(
	null,
);

export const resetNewTicketFormAtom = atom(null, (_get, set) => {
	set(newTicketTitleAtom, '');
	set(newTicketDateAtom, '');
	set(newTicketImageAtom, null);
	set(newTicketImageFileNameAtom, null);
	set(newTicketCategoryAtom, null);
});
