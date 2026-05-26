import { atom } from 'jotai';

import { MOCK_PLACES } from './api';
import type { Place } from './place.model';

export const placesAtom = atom<Place[]>([]);
export const placesHydratedAtom = atom<boolean>(false);

export const setPlacesAtom = atom(null, (get, set, newPlaces: Place[]) => {
	set(placesAtom, newPlaces);
	if (!get(placesHydratedAtom)) {
		set(placesHydratedAtom, true);
	}
});

export const hydratePlacesAtom = atom(null, (get, set) => {
	if (!get(placesHydratedAtom)) {
		set(placesHydratedAtom, true);
	}
});

const initialFavoritePlaceIds = MOCK_PLACES.filter(
	place => place.isFavorite,
).map(place => place.id);

export const favoritePlaceIdsAtom = atom<string[]>(initialFavoritePlaceIds);
