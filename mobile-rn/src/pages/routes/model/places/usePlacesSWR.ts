import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';

import { placesApi } from './api';
import type { Place } from './place.model';
import {
	hydratePlacesAtom,
	placesAtom,
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
	const [places] = useAtom(placesAtom);
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
			const data = await placesApi.getMyPlaces();
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
