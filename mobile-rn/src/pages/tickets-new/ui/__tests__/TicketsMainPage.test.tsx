import { render, waitFor } from '@testing-library/react-native';
import { createStore, Provider as JotaiProvider } from 'jotai';
import React from 'react';

import * as ticketModule from '@/entities/ticket';
import type { Ticket } from '@/entities/ticket';

import { TicketsMainPage } from '../TicketsMainPage';

// Mock router
jest.mock('expo-router', () => ({
	useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

// Spy and mock API method directly (ticketApi is a const object, cannot spy on property getter)
const getMyTicketsMock = jest
	.spyOn(ticketModule.ticketApi, 'getMyTickets')
	.mockImplementation(() => Promise.resolve([]));

// Helper to wrap with jotai provider so we can pass initial tickets
function renderWithState(initialTickets: Ticket[] = []) {
	const store = createStore();
	store.set(ticketModule.ticketsAtom, initialTickets);
	return render(
		<JotaiProvider store={store}>
			<TicketsMainPage />
		</JotaiProvider>,
	);
}

describe('TicketsMainPage', () => {
	beforeEach(() => {
		getMyTicketsMock.mockReset();
	});

	it('shows loading then empty state', async () => {
		getMyTicketsMock.mockResolvedValueOnce([]);
		const { queryByTestId } = renderWithState([]);
		expect(queryByTestId('tickets-loading')).not.toBeNull();
		await waitFor(() =>
			expect(queryByTestId('tickets-empty')).not.toBeNull(),
		);
	});

	it('shows list when api returns tickets', async () => {
		getMyTicketsMock.mockResolvedValueOnce([
			{
				id: '1',
				title: 'A',
				from: 'A',
				to: 'B',
				departureTime: '2024-01-01',
				arrivalTime: '2024-01-01',
				isUsed: false,
				type: 'train',
				businessCategory: 'transport',
			},
		]);
		const { queryByTestId } = renderWithState([]);
		await waitFor(() =>
			expect(queryByTestId('tickets-list')).not.toBeNull(),
		);
	});
});
