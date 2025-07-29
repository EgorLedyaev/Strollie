import { atom } from 'jotai';

import type { RoutePreferences } from '@/src/features/map/ui/RouteSettingsPanel';

export const routePreferencesAtom = atom<RoutePreferences>({
	preferParks: false,
	avoidHills: true,
	walkingSpeed: 5,
	desiredDistance: 5.0,
});

export const isBuildingRouteAtom = atom(false);
export const actualRouteDistanceAtom = atom<number | null>(null);
