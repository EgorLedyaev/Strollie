import { atom } from 'jotai';

import type { Ticket } from './ticket.model';

/**
 * Currently selected ticket for viewing details.
 * Pure UI state — server data is managed by React Query.
 */
export const currentTicketAtom = atom<Ticket | null>(null);
