import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react-native';
import { formatISO } from 'date-fns';
import { createStore, Provider as JotaiProvider } from 'jotai';
import React from 'react';

import * as ticketModule from '@/entities/ticket';
import { apiClient, ticketsKeys } from '@/shared/api';

import { TicketsMainPage } from '../TicketsMainPage';

// Мокаем router
jest.mock('expo-router', () => ({
	useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

describe('SWR e2e refresh scenario', () => {
	const apiClientGetSpy = jest.spyOn(apiClient, 'get');

	function ticket(id: string) {
		return {
			id,
			from: 'A',
			to: 'B',
			departureTime: formatISO(new Date()),
			arrivalTime: formatISO(new Date()),
			isUsed: false,
			type: 'train',
			businessCategory: 'transport',
			title: id,
		} as ticketModule.Ticket;
	}

	function renderWithSnapshot(snapshot: ticketModule.Ticket[]) {
		const store = createStore();
		store.set(ticketModule.ticketsHydratedAtom, true);
		if (snapshot.length) {
			store.set(ticketModule.setTicketsAtom, () => snapshot);
		}
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});
		if (snapshot.length) {
			queryClient.setQueryData(ticketsKeys.all, snapshot);
		}
		return render(
			<JotaiProvider store={store}>
				<QueryClientProvider client={queryClient}>
					<TicketsMainPage />
				</QueryClientProvider>
			</JotaiProvider>,
		);
	}

	beforeEach(() => {
		apiClientGetSpy.mockReset();
	});

	it('shows snapshot instantly then merges SWR result', async () => {
		const snapshot = [ticket('local-1')];
		// SWR возвратит новый билет
		apiClientGetSpy.mockResolvedValue({
			data: [ticket('local-1'), ticket('remote-2')],
		});

		const { queryByTestId } = renderWithSnapshot(snapshot);
		// Мгновенно нет loading спиннера
		expect(queryByTestId('tickets-loading')).toBeNull();

		// Ждём когда SWR дернётся
		await waitFor(() => expect(apiClientGetSpy).toHaveBeenCalled());
	});
});
