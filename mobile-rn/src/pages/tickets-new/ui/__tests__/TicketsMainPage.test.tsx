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

// Spy mocks
const getMyTicketsMock = jest
	.spyOn(ticketModule.ticketApi, 'getMyTickets')
	.mockImplementation(() => Promise.resolve([]));
const getMyTicketsSWRMock = jest
	.spyOn(ticketModule.ticketApi, 'getMyTicketsSWR')
	.mockImplementation(() => Promise.resolve([]));

// Helper to wrap with jotai provider so we can pass initial tickets
function renderWithState(initialTickets: Ticket[] = []) {
	const store = createStore();
	// Помечаем как уже гидратированное (иначе компонент сам дернёт hydrate + сетевой вызов)
	store.set(ticketModule.ticketsHydratedAtom, true);
	if (initialTickets.length) {
		store.set(ticketModule.setTicketsAtom, () => initialTickets);
	}
	return render(
		<JotaiProvider store={store}>
			<TicketsMainPage />
		</JotaiProvider>,
	);
}

describe('TicketsMainPage', () => {
	beforeEach(() => {
		getMyTicketsMock.mockReset();
		getMyTicketsSWRMock.mockReset();
	});

	it('shows loading then empty state', async () => {
		getMyTicketsMock.mockResolvedValueOnce([]);
		const { queryByTestId } = renderWithState([]);
		expect(queryByTestId('tickets-loading')).not.toBeNull();
		await waitFor(() =>
			expect(queryByTestId('tickets-empty')).not.toBeNull(),
		);
		// SWR не должен дёргаться если нет данных и snapshot пустой (первый блокинг запрос уже был)
		expect(getMyTicketsSWRMock).toHaveBeenCalledTimes(0);
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

	it('uses SWR refresh when snapshot present', async () => {
		// Сценарий: уже есть локальный билет (snapshot), TTL истёк -> блокирующий не нужен, должен пойти SWR путь
		// Для простоты имитируем что blocking fetch пропускается (tickets не пустой), и SWR возвращает обновлённый список
		getMyTicketsSWRMock.mockResolvedValueOnce([
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
		// snapshot изначально
		const snapshot: Ticket[] = [
			{
				id: 'snap',
				from: 'X',
				to: 'Y',
				departureTime: '2024-01-10',
				arrivalTime: '2024-01-10',
				isUsed: false,
				type: 'train',
				businessCategory: 'transport',
				title: 'Snapshot',
			},
		];
		const { queryByTestId } = renderWithState(snapshot);
		// Должен сразу показать список (без спиннера) тк snapshot есть
		expect(queryByTestId('tickets-loading')).toBeNull();
		await waitFor(() => expect(getMyTicketsSWRMock).toHaveBeenCalled());
	});
});
