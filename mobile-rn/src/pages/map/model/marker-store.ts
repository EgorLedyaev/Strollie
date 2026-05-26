import { atom } from 'jotai';

export interface PlacedMarkerData {
	id: string;
	coordinates: [number, number];
	/** Дополнительные данные для повторного открытия снизу */
	placeData?: unknown;
	title?: string;
	color?: string;
	isRoutePoint?: boolean;
}

export const placedMarkersAtom = atom<PlacedMarkerData[]>([]);
