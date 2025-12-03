import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react-native';
import { createStore, Provider as JotaiProvider } from 'jotai';
import React from 'react';

import type { Ticket } from '@/entities/ticket';
import { ticketApi } from '@/entities/ticket/api/ticketApi';
import { ticketsKeys } from '@/shared/api';

import { TicketsMainPage } from '../TicketsMainPage';

// Mock router
jest.mock('expo-router', () => ({
	useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

// Spy on ticketApi (now used directly instead of axiosClient)
const getMyTicketsMock = jest.spyOn(ticketApi, 'getMyTickets');

// Helper to wrap with providers and optionally pre-populate React Query cache
function renderWithState(initialTickets: Ticket[] = []) {
	const store = createStore();
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});
	// Pre-populate query cache if initialTickets are provided
	if (initialTickets.length) {
		queryClient.setQueryData(ticketsKeys.all, initialTickets);
	}
	return render(
		<JotaiProvider store={store}>
			<QueryClientProvider client={queryClient}>
				<TicketsMainPage />
			</QueryClientProvider>
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

	it('shows cached data instantly when available in React Query', async () => {
		// React Query cache already has data - should show list immediately
		getMyTicketsMock.mockResolvedValueOnce([
			{
				id: '2',
				title: 'B',
				from: 'A',
				to: 'C',
				departureTime: '2024-02-01',
				arrivalTime: '2024-02-01',
				isUsed: false,
				type: 'train',
				businessCategory: 'transport',
			},
		]);

		const cachedTickets: Ticket[] = [
			{
				id: 'cached',
				from: 'X',
				to: 'Y',
				departureTime: '2024-01-10',
				arrivalTime: '2024-01-10',
				isUsed: false,
				type: 'train',
				businessCategory: 'transport',
				title: 'Cached Ticket',
			},
		];
		const { queryByTestId } = renderWithState(cachedTickets);

		// Should show list immediately without loading spinner (cache hit)
		expect(queryByTestId('tickets-loading')).toBeNull();
		expect(queryByTestId('tickets-list')).not.toBeNull();

		// Background refetch should still happen
		await waitFor(() => expect(getMyTicketsMock).toHaveBeenCalled());
	});
});
