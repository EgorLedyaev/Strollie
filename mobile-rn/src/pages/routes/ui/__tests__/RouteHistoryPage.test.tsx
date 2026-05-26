import { fireEvent, render, screen } from '@testing-library/react-native';
import { formatISO, startOfToday, subDays } from 'date-fns';
import { useAtom } from 'jotai';
import React from 'react';
import { Pressable, View } from 'react-native';

import { useRoutesSWR } from '@/pages/routes/model/routes';
import { EmptyState } from '@/widgets/empty-state';
import { AppText } from '@/shared/ui';

import { RouteCard } from '../route-card/RouteCard';
import { RouteHistoryPage } from '../RouteHistoryPage';

jest.mock('@/pages/routes/model/routes', () => ({
	...jest.requireActual('@/pages/routes/model/routes'),
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
		const today = startOfToday();
		const yesterday = subDays(today, 1);

		const mockRoutes = [
			{
				id: '1',
				date: formatISO(yesterday),
				title: 'Yesterday Route',
			},
			{ id: '2', date: formatISO(today), title: 'Today Route 1' },
			{ id: '3', date: formatISO(today), title: 'Today Route 2' },
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
			{ id: '1', date: formatISO(startOfToday()), title: 'Test Route' },
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
