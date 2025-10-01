import { atom } from 'jotai';

export interface PlacedMarkerData {
	id: string;
	coordinates: [number, number];
}

export const placedMarkersAtom = atom<PlacedMarkerData[]>([]);
