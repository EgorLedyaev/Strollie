import { atom } from 'jotai';

import { MOCK_ROUTES } from '../api/routeApi';
import { Route } from './route.model';

export const routesAtom = atom<Route[]>([]);

export const routesHydratedAtom = atom<boolean>(false);

export const setRoutesAtom = atom(null, (get, set, newRoutes: Route[]) => {
	set(routesAtom, newRoutes);
	if (!get(routesHydratedAtom)) {
		set(routesHydratedAtom, true);
	}
});

export const hydrateRoutesAtom = atom(null, (get, set) => {
	if (!get(routesHydratedAtom)) {
		set(routesHydratedAtom, true);
	}
});

const initialFavoriteRouteIds = MOCK_ROUTES.filter(
	route => route.isFavorite,
).map(route => route.id);

// Используем их как начальное значение для атома
export const favoriteRouteIdsAtom = atom<string[]>(initialFavoriteRouteIds);
