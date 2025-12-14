import { atom } from 'jotai';

import type { RouteGenerationResponse } from './types';

/**
 * Хранит последний сгенерированный маршрут для отображения на карте.
 */
export const generatedRouteAtom = atom<RouteGenerationResponse | null>(null);
