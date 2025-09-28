import { atom } from 'jotai';

import { Place } from '@/entities/place';

import { MOCK_PLACES } from '../api/placeApi';

export const placeAtom = atom<Place[]>([]);

export const placesHydratedAtom = atom<boolean>(false);

export const setPlacesAtom = atom(null, (get, set, newPlaces: Place[]) => {
	set(placeAtom, newPlaces);
	if (!get(placesHydratedAtom)) {
		set(placesHydratedAtom, true);
	}
});

export const hydratePlacesAtom = atom(null, (get, set) => {
	if (!get(placesHydratedAtom)) {
		set(placesHydratedAtom, true);
	}
});

// export const favoritePlaceIdsAtom = atom<string[]>([]);

const initialFavoritePlaceIds = MOCK_PLACES.filter(
	place => place.isFavorite,
).map(place => place.id);

export const favoritePlaceIdsAtom = atom<string[]>(initialFavoritePlaceIds);
