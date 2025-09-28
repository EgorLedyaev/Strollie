import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';

import { placeApi } from '../api/placeApi';
import { Place } from './place.model';
import {
	hydratePlacesAtom,
	placeAtom,
	placesHydratedAtom,
	setPlacesAtom,
} from './place.state';

interface UsePlacesSWRResult {
	places: Place[];
	isHydrated: boolean;
	isLoading: boolean;
	error: Error | null;
	forceRefresh: () => Promise<void>;
}

export function usePlacesSWR(): UsePlacesSWRResult {
	const [places] = useAtom(placeAtom);
	const [hydrated] = useAtom(placesHydratedAtom);
	const [, hydrate] = useAtom(hydratePlacesAtom);
	const [, setPlaces] = useAtom(setPlacesAtom);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		hydrate();
	}, [hydrate]);

	const doFetch = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await placeApi.getMyPlaces();

			setPlaces(data);
		} catch (e) {
			setError(e instanceof Error ? e : new Error('Unknown error'));
		} finally {
			setIsLoading(false);
		}
	}, [setPlaces]);

	useEffect(() => {
		if (hydrated && places.length === 0) {
			void doFetch();
		}
	}, [hydrated, places.length, doFetch]);

	return {
		places,
		isHydrated: hydrated,
		isLoading: !hydrated || isLoading,
		error,
		forceRefresh: doFetch,
	};
}
