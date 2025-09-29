import { fireEvent, render, screen } from '@testing-library/react-native';
import { useAtom } from 'jotai';
import React from 'react';
import { Pressable, View } from 'react-native';

import { EmptyState } from '@/widgets/empty-state';
import { useRoutesSWR } from '@/entities/route';
import { AppText } from '@/shared/ui';

import { RouteCard } from '../route-card/RouteCard';
import { RouteHistoryPage } from '../RouteHistoryPage';

jest.mock('@/entities/route', () => ({
	...jest.requireActual('@/entities/route'),
	useRoutesSWR: jest.fn(),
}));
jest.mock('jotai', () => ({
	...jest.requireActual('jotai'),
	useAtom: jest.fn(),
}));

jest.mock('@/widgets/header', () => ({ Header: () => <></> }));
jest.mock('@/widgets/empty-state', () => ({ EmptyState: jest.fn() }));
jest.mock('../route-card/RouteCard', () => ({ RouteCard: jest.fn() }));

const mockedUseRoutesSWR = useRoutesSWR as jest.Mock;
const mockedUseAtom = useAtom as jest.Mock;
const MockedEmptyState = EmptyState as jest.Mock;
const MockedRouteCard = RouteCard as jest.Mock;

describe('RouteHistoryPage', () => {
	beforeEach(() => {
		mockedUseRoutesSWR.mockClear();
		mockedUseAtom.mockClear();

		mockedUseAtom.mockReturnValue([[], jest.fn()]);

		MockedEmptyState.mockImplementation(({ testId }) => (
			<View testID={testId} />
		));

		MockedRouteCard.mockImplementation(({ route, onToggleFavorite }) => (
			<View testID={`route-card-${route.id}`}>
				<Pressable
					testID={`toggle-favorite-${route.id}`}
					onPress={() => onToggleFavorite(route.id)}
				>
					<AppText>{route.title}</AppText>
				</Pressable>
			</View>
		));
	});

	it('should render loading indicator when isLoading is true', () => {
		mockedUseRoutesSWR.mockReturnValue({
			routes: [],
			isLoading: true,
			error: null,
			isHydrated: false,
		});
		render(<RouteHistoryPage />);
		expect(screen.getByTestId('history-loading')).toBeTruthy();
		expect(screen.queryByTestId('history-list')).toBeNull();
	});

	it('should render error state when an error occurs', () => {
		mockedUseRoutesSWR.mockReturnValue({
			routes: [],
			isLoading: false,
			error: new Error('Network Error'),
			isHydrated: true,
		});
		render(<RouteHistoryPage />);
		expect(screen.getByTestId('history-error')).toBeTruthy();
	});

	it('should render empty state when there are no routes', () => {
		mockedUseRoutesSWR.mockReturnValue({
			routes: [],
			isLoading: false,
			error: null,
			isHydrated: true,
		});
		render(<RouteHistoryPage />);
		expect(screen.getByTestId('history-empty')).toBeTruthy();
	});

	it('should render sections with routes correctly sorted', () => {
		const today = new Date();
		const yesterday = new Date();
		yesterday.setDate(today.getDate() - 1);

		const mockRoutes = [
			{
				id: '1',
				date: yesterday.toISOString(),
				title: 'Yesterday Route',
			},
			{ id: '2', date: today.toISOString(), title: 'Today Route 1' },
			{ id: '3', date: today.toISOString(), title: 'Today Route 2' },
		];

		mockedUseRoutesSWR.mockReturnValue({
			routes: mockRoutes,
			isLoading: false,
			error: null,
			isHydrated: true,
		});
		mockedUseAtom.mockReturnValue([['3'], jest.fn()]);

		render(<RouteHistoryPage />);

		expect(screen.getByTestId('history-list')).toBeTruthy();
		expect(screen.getByText('Сегодня')).toBeTruthy();
		expect(screen.getByText('В предыдущие дни')).toBeTruthy();
		expect(screen.getByTestId('route-card-1')).toBeTruthy();
		expect(screen.getByTestId('route-card-2')).toBeTruthy();
		expect(screen.getByTestId('route-card-3')).toBeTruthy();
	});

	it('should call setFavoriteRouteIds when a route is toggled', () => {
		const mockSetFavorite = jest.fn();
		const mockRoutes = [
			{ id: '1', date: new Date().toISOString(), title: 'Test Route' },
		];

		mockedUseRoutesSWR.mockReturnValue({
			routes: mockRoutes,
			isLoading: false,
			error: null,
			isHydrated: true,
		});
		mockedUseAtom.mockReturnValue([[], mockSetFavorite]);

		render(<RouteHistoryPage />);

		const toggleButton = screen.getByTestId('toggle-favorite-1');
		fireEvent.press(toggleButton);

		expect(mockSetFavorite).toHaveBeenCalledTimes(1);
	});
});
