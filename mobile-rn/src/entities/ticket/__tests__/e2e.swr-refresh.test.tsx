import { render, waitFor } from '@testing-library/react-native';
import { createStore, Provider as JotaiProvider } from 'jotai';
import React from 'react';

import { TicketsMainPage } from '@/pages/tickets-new/ui/TicketsMainPage';
import * as ticketModule from '@/entities/ticket';

// Мокаем router
jest.mock('expo-router', () => ({
	useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

describe('SWR e2e refresh scenario', () => {
	const getMyTicketsSpy = jest.spyOn(ticketModule.ticketApi, 'getMyTickets');
	const getMyTicketsSWRSpy = jest.spyOn(
		ticketModule.ticketApi,
		'getMyTicketsSWR',
	);

	function ticket(id: string) {
		return {
			id,
			from: 'A',
			to: 'B',
			departureTime: new Date().toISOString(),
			arrivalTime: new Date().toISOString(),
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
		return render(
			<JotaiProvider store={store}>
				<TicketsMainPage />
			</JotaiProvider>,
		);
	}

	beforeEach(() => {
		getMyTicketsSpy.mockReset();
		getMyTicketsSWRSpy.mockReset();
	});

	it('shows snapshot instantly then merges SWR result', async () => {
		const snapshot = [ticket('local-1')];
		// SWR возвратит новый билет
		getMyTicketsSWRSpy.mockImplementation(async opts => {
			opts?.onUpdate?.([ticket('local-1'), ticket('remote-2')]);
			return [ticket('local-1'), ticket('remote-2')];
		});

		const { queryByTestId } = renderWithSnapshot(snapshot);
		// Мгновенно нет loading спиннера
		expect(queryByTestId('tickets-loading')).toBeNull();

		// Ждём когда SWR дернётся
		await waitFor(() => expect(getMyTicketsSWRSpy).toHaveBeenCalled());
	});
});
