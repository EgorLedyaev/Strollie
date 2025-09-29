import {
	fireEvent,
	render,
	screen,
	within,
} from '@testing-library/react-native';
import { useAtom } from 'jotai';
import React from 'react';
import { Pressable, View } from 'react-native';

import { EmptyState } from '@/widgets/empty-state';
import { favoritePlaceIdsAtom, usePlacesSWR } from '@/entities/place';
import { favoriteRouteIdsAtom, useRoutesSWR } from '@/entities/route';
import { AppText } from '@/shared/ui';

import { PlaceCard } from '../place-card/PlaceCard';
import { RouteCard } from '../route-card/RouteCard';
import { SavedRoutesPage } from '../SavedRoutesPage';

jest.mock('@/entities/route', () => ({
	...jest.requireActual('@/entities/route'),
	useRoutesSWR: jest.fn(),
	favoriteRouteIdsAtom: { debugLabel: 'favoriteRouteIdsAtom' },
}));
jest.mock('@/entities/place', () => ({
	...jest.requireActual('@/entities/place'),
	usePlacesSWR: jest.fn(),
	favoritePlaceIdsAtom: { debugLabel: 'favoritePlaceIdsAtom' },
}));
jest.mock('jotai', () => ({
	...jest.requireActual('jotai'),
	useAtom: jest.fn(),
}));

jest.mock('@/widgets/header', () => ({ Header: () => <></> }));
jest.mock('@/widgets/empty-state', () => ({ EmptyState: jest.fn() }));
jest.mock('../route-card/RouteCard', () => ({ RouteCard: jest.fn() }));
jest.mock('../place-card/PlaceCard', () => ({ PlaceCard: jest.fn() }));

const mockedUseRoutesSWR = useRoutesSWR as jest.Mock;
const mockedUsePlacesSWR = usePlacesSWR as jest.Mock;
const mockedUseAtom = useAtom as jest.Mock;
const MockedEmptyState = EmptyState as jest.Mock;
const MockedRouteCard = RouteCard as jest.Mock;
const MockedPlaceCard = PlaceCard as jest.Mock;

const mockRoutes = [
	{ id: 'r1', title: 'маршрут 1', distance: 10, isFavorite: true },
	{ id: 'r2', title: 'маршрут 2', distance: 5, isFavorite: true },
];
const mockPlaces = [
	{ id: 'p1', title: 'место 1', address: '...', isFavorite: true },
	{ id: 'p2', title: 'место 2', address: '...', isFavorite: true },
];

describe('SavedRoutesPage', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		MockedEmptyState.mockImplementation(({ testId }) => (
			<View testID={testId} />
		));

		MockedRouteCard.mockImplementation(({ route, onToggleFavorite }) => (
			<View testID={`route-card-${route.id}`}>
				<Pressable
					testID={`toggle-favorite-route-${route.id}`}
					onPress={() => onToggleFavorite(route.id)}
				>
					<AppText>{route.title}</AppText>
				</Pressable>
			</View>
		));

		MockedPlaceCard.mockImplementation(({ place, onToggleFavorite }) => (
			<View testID={`place-card-${place.id}`}>
				<Pressable
					testID={`toggle-favorite-place-${place.id}`}
					onPress={() => onToggleFavorite(place.id)}
				>
					<AppText>{place.title}</AppText>
				</Pressable>
			</View>
		));
	});

	it('should render loading indicator if routes are loading', () => {
		mockedUseRoutesSWR.mockReturnValue({
			routes: [],
			isLoading: true,
			error: null,
		});
		mockedUsePlacesSWR.mockReturnValue({
			places: [],
			isLoading: false,
			isHydrated: true,
			error: null,
		});
		mockedUseAtom.mockReturnValue([[], jest.fn()]);

		render(<SavedRoutesPage />);
		expect(screen.getByTestId('favourites-loading')).toBeTruthy();
	});

	it('should render error state if places have an error', () => {
		mockedUseRoutesSWR.mockReturnValue({
			routes: [],
			isLoading: false,
			error: null,
		});
		mockedUsePlacesSWR.mockReturnValue({
			places: [],
			isLoading: false,
			isHydrated: true,
			error: new Error('Failed to fetch'),
		});
		mockedUseAtom.mockReturnValue([[], jest.fn()]);

		render(<SavedRoutesPage />);
		expect(screen.getByTestId('favourites-error')).toBeTruthy();
	});

	it('should render empty state when there are no favorite items', () => {
		mockedUseRoutesSWR.mockReturnValue({
			routes: mockRoutes,
			isLoading: false,
			error: null,
		});
		mockedUsePlacesSWR.mockReturnValue({
			places: mockPlaces,
			isLoading: false,
			isHydrated: true,
			error: null,
		});
		mockedUseAtom.mockImplementation(atom => {
			if (atom === favoriteRouteIdsAtom) return [[], jest.fn()];
			if (atom === favoritePlaceIdsAtom) return [[], jest.fn()];
			return [[], jest.fn()];
		});

		render(<SavedRoutesPage />);
		expect(screen.getByTestId('favourites-empty')).toBeTruthy();
	});
});

describe('Data display and filtering', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		MockedRouteCard.mockImplementation(({ route, onToggleFavorite }) => (
			<View testID={`route-card-${route.id}`}>
				<Pressable
					testID={`toggle-favorite-route-${route.id}`}
					onPress={() => onToggleFavorite(route.id)}
				>
					<AppText>{route.title}</AppText>
				</Pressable>
			</View>
		));
		MockedPlaceCard.mockImplementation(({ place, onToggleFavorite }) => (
			<View testID={`place-card-${place.id}`}>
				<Pressable
					testID={`toggle-favorite-place-${place.id}`}
					onPress={() => onToggleFavorite(place.id)}
				>
					<AppText>{place.title}</AppText>
				</Pressable>
			</View>
		));

		mockedUseRoutesSWR.mockReturnValue({
			routes: mockRoutes,
			isLoading: false,
			error: null,
		});
		mockedUsePlacesSWR.mockReturnValue({
			places: mockPlaces,
			isLoading: false,
			isHydrated: true,
			error: null,
		});
		mockedUseAtom.mockImplementation(atom => {
			if (atom === favoriteRouteIdsAtom) return [['r1', 'r2'], jest.fn()];
			if (atom === favoritePlaceIdsAtom) return [['p1', 'p2'], jest.fn()];
			return [[], jest.fn()];
		});
	});

	it('should render a sorted list of all favorite items by default', () => {
		render(<SavedRoutesPage />);

		expect(screen.getByTestId('route-card-r1')).toBeTruthy();
		expect(screen.getByTestId('place-card-p1')).toBeTruthy();

		const allCardViews = screen.getAllByTestId(/card/);
		expect(within(allCardViews[0]).getByText('маршрут 1')).toBeTruthy();
		expect(within(allCardViews[1]).getByText('маршрут 2')).toBeTruthy();
		expect(within(allCardViews[2]).getByText('место 1')).toBeTruthy();
		expect(within(allCardViews[3]).getByText('место 2')).toBeTruthy();
	});

	it('should filter to show only places when "Места" filter is clicked', () => {
		render(<SavedRoutesPage />);
		fireEvent.press(screen.getByText('Места'));

		expect(screen.getByTestId('place-card-p1')).toBeTruthy();
		expect(screen.getByTestId('place-card-p2')).toBeTruthy();
		expect(screen.queryByTestId('route-card-r1')).toBeNull();
		expect(screen.queryByTestId('route-card-r2')).toBeNull();
	});

	it('should filter to show only routes when "Маршруты" filter is clicked', () => {
		render(<SavedRoutesPage />);
		fireEvent.press(screen.getByText('Маршруты'));

		expect(screen.queryByTestId('place-card-p1')).toBeNull();
		expect(screen.queryByTestId('place-card-p2')).toBeNull();
		expect(screen.getByTestId('route-card-r1')).toBeTruthy();
		expect(screen.getByTestId('route-card-r2')).toBeTruthy();
	});

	it('should toggle filter off and show all items again', () => {
		render(<SavedRoutesPage />);
		fireEvent.press(screen.getByText('Места'));
		fireEvent.press(screen.getByText('Места'));

		expect(screen.getByTestId('place-card-p1')).toBeTruthy();
		expect(screen.getByTestId('route-card-r1')).toBeTruthy();
	});
});

describe('User interactions', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		MockedRouteCard.mockImplementation(({ route, onToggleFavorite }) => (
			<View testID={`route-card-${route.id}`}>
				<Pressable
					testID={`toggle-favorite-route-${route.id}`}
					onPress={() => onToggleFavorite(route.id)}
				>
					<AppText>{route.title}</AppText>
				</Pressable>
			</View>
		));
	});

	it('should call the correct favorite toggle function for a route', () => {
		const mockSetFavoriteRoutes = jest.fn();
		mockedUseRoutesSWR.mockReturnValue({
			routes: mockRoutes,
			isLoading: false,
			error: null,
		});
		mockedUsePlacesSWR.mockReturnValue({
			places: [],
			isLoading: false,
			isHydrated: true,
			error: null,
		});
		mockedUseAtom.mockImplementation(atom => {
			if (atom === favoriteRouteIdsAtom)
				return [['r1'], mockSetFavoriteRoutes];
			if (atom === favoritePlaceIdsAtom) return [[], jest.fn()];
			return [[], jest.fn()];
		});

		render(<SavedRoutesPage />);
		fireEvent.press(screen.getByTestId('toggle-favorite-route-r1'));
		expect(mockSetFavoriteRoutes).toHaveBeenCalledTimes(1);
	});
});
