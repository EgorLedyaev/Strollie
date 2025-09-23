import { render, waitFor } from '@testing-library/react-native';
import { createStore, Provider as JotaiProvider } from 'jotai';
import React from 'react';

import * as ticketModule from '@/entities/ticket';
import type { Ticket } from '@/entities/ticket';

import { SavedRoutesPage } from '../SavedRoutesPage';

jest.mock('expo-router', () => ({
	useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

describe('SavedRoutesPage states', () => {
	const getMyTicketsMock = jest
		.spyOn(ticketModule.ticketApi, 'getMyTickets')
		.mockImplementation(() => Promise.resolve([]));

	function ticket(id: string): Ticket {
		return {
			id,
			from: 'A',
			to: 'B',
			departureTime: '2024-01-01',
			arrivalTime: '2024-01-01',
			isUsed: false,
			type: 'train',
			businessCategory: 'transport',
			title: id,
		} as Ticket;
	}

	function renderWithTickets(initial: Ticket[]) {
		const store = createStore();
		store.set(ticketModule.ticketsHydratedAtom, true);
		if (initial.length) {
			store.set(ticketModule.setTicketsAtom, () => initial);
		}
		return render(
			<JotaiProvider store={store}>
				<SavedRoutesPage />
			</JotaiProvider>,
		);
	}

	beforeEach(() => {
		getMyTicketsMock.mockReset();
	});

	it('shows empty placeholder when no tickets at all', async () => {
		getMyTicketsMock.mockResolvedValueOnce([]);
		const { queryByTestId } = renderWithTickets([]);
		await waitFor(() =>
			expect(queryByTestId('favourites-empty')).not.toBeNull(),
		);
	});

	it('still shows empty placeholder even when tickets exist (design decision)', async () => {
		getMyTicketsMock.mockResolvedValueOnce([ticket('t1')]);
		const { queryByTestId } = renderWithTickets([ticket('t1')]);
		await waitFor(() =>
			expect(queryByTestId('favourites-empty')).not.toBeNull(),
		);
	});
});
