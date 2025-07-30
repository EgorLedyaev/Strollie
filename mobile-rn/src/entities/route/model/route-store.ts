import { atom } from 'jotai';

// Интерфейс для настроек маршрута
export interface RoutePreferences {
	preferParks: boolean;
	avoidHills: boolean;
	walkingSpeed: number; // км/ч
	desiredDistance: number; // км
}

export const routePreferencesAtom = atom<RoutePreferences>({
	preferParks: false,
	avoidHills: true,
	walkingSpeed: 5,
	desiredDistance: 5.0,
});

export const isBuildingRouteAtom = atom(false);
export const actualRouteDistanceAtom = atom<number | null>(null);
