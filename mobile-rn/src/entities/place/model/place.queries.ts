import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
	fetchPlaceDetailsById,
	geocodeAddress,
	suggestPlaces,
	type PlacesAPIResult,
} from '@/shared/api';
import { placesKeys } from '@/shared/api/query-keys';

interface UseSuggestPlacesOptions {
	limit?: number;
	enabled?: boolean;
}

export const useSuggestPlacesQuery = (
	query: string,
	{ limit = 10, enabled = true }: UseSuggestPlacesOptions = {},
) => {
	const trimmedQuery = query.trim();
	return useQuery({
		queryKey: placesKeys.suggest(trimmedQuery, limit),
		enabled: enabled && trimmedQuery.length >= 2,
		queryFn: () => suggestPlaces(trimmedQuery, limit),
		placeholderData: previous => previous ?? [],
		staleTime: 30 * 1000,
	});
};

export const usePlaceDetailsQuery = (suggestId: string | null) => {
	return useQuery({
		queryKey: placesKeys.details(suggestId ?? ''),
		enabled: Boolean(suggestId),
		queryFn: () => fetchPlaceDetailsById(suggestId!),
		staleTime: 5 * 60 * 1000,
	});
};

interface UseGeocodeOptions {
	location?: [number, number];
	results?: number;
	enabled?: boolean;
}

export const useGeocodeQuery = (
	query: string,
	{ location, results = 10, enabled = true }: UseGeocodeOptions = {},
) => {
	const params = useMemo(
		() => ({ query: query.trim(), location, results }),
		[query, location, results],
	);

	return useQuery<PlacesAPIResult[]>({
		queryKey: placesKeys.geocode(
			params.query,
			params.location,
			params.results,
		),
		enabled: enabled && Boolean(params.query),
		queryFn: async () => {
			const response = await geocodeAddress(
				params.query,
				params.location,
				params.results,
			);
			return response?.result?.items ?? [];
		},
		placeholderData: previous => previous ?? [],
		staleTime: 60 * 1000,
	});
};
