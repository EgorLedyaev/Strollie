import { EXPO_PUBLIC_2GIS_API_KEY } from '@/shared/config/api';

import type { PlacesAPIResult } from './geocoder.service';

const API_KEY = EXPO_PUBLIC_2GIS_API_KEY;
const SUGGEST_API_URL = 'https://catalog.api.2gis.com/3.0/suggests';
const PLACES_BY_ID_URL = 'https://catalog.api.2gis.com/3.0/items/byid';

/** Suggest API item (subset overlapping with PlacesAPIResult) */
export interface SuggestItem {
	id: string; // composite id like "141265769584430_141265769584430"
	name: string;
	full_name?: string;
	address_name?: string;
	subtitle?: string; // sometimes suggest provides extra line
	point?: { lon: number; lat: number };
	// original raw object for future extension
	[key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface SuggestResponse {
	meta: {
		code: number;
		error?: { message: string; type: string };
	};
	result?: {
		items: SuggestItem[];
		total: number;
	};
}

/** Detailed response for byid (reuse PlacesAPIResult shape) */
export interface PlaceByIdResponse {
	meta: { code: number; error?: { message: string; type: string } };
	result?: { items: PlacesAPIResult[] };
}

/**
 * Call 2GIS Suggest API.
 * @param query user input
 * @param limit max number of suggestions (<= 20 typical)
 */
export async function suggestPlaces(
	query: string,
	limit = 10,
): Promise<SuggestItem[]> {
	if (!query.trim() || !API_KEY) return [];
	try {
		const params: Record<string, string> = {
			q: query,
			key: API_KEY,
			page_size: String(limit),
			fields: 'items.point,items.full_name,items.address_name',
		};
		const data = await request2GIS<SuggestResponse>(
			SUGGEST_API_URL,
			params,
		);
		if (data.meta.code === 200 && data.result) return data.result.items;
		return [];
	} catch (e) {
		console.warn('[Suggest] error', e);
		return [];
	}
}

/**
 * Fetch detail for a selected suggestion by its numeric id part.
 * Suggest id usually formatted <objectId>_<segmentId>. Use part before underscore for byid.
 */

export async function fetchPlaceDetailsById(
	suggestId: string,
): Promise<PlacesAPIResult | null> {
	if (!suggestId || !API_KEY) return null;
	const objectId = suggestId.split('_')[0];
	try {
		const params = {
			id: objectId,
			key: API_KEY,
			fields: 'items.point,items.full_name,items.address_name',
		};
		const data = await request2GIS<PlaceByIdResponse>(
			PLACES_BY_ID_URL,
			params,
		);
		if (
			data.meta.code === 200 &&
			data.result &&
			data.result.items.length > 0
		) {
			return data.result.items[0];
		}
	} catch (e) {
		console.warn('[Suggest] byid error', e);
	}
	return null;
}

async function request2GIS<T>(
	url: string,
	params: Record<string, string>,
	timeout = 8000,
): Promise<T> {
	const endpoint = new URL(url);
	Object.entries(params).forEach(([key, value]) => {
		endpoint.searchParams.append(key, value);
	});
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);
	try {
		const response = await fetch(endpoint.toString(), {
			method: 'GET',
			signal: controller.signal,
		});
		if (!response.ok) {
			throw new Error(
				`2GIS request failed with status ${response.status}`,
			);
		}
		return (await response.json()) as T;
	} finally {
		clearTimeout(timeoutId);
	}
}
