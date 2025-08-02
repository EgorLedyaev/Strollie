import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Ticket } from './ticket.model';

// Хранит все билеты пользователя
export const ticketsAtom = atomWithStorage<Ticket[]>('tickets', []);

// Текущий выбранный билет (для просмотра деталей)
export const currentTicketAtom = atom<Ticket | null>(null);
