// src/shared/api/geocoder.service.ts
import { EXPO_PUBLIC_2GIS_API_KEY } from '@/shared/config/api';

const API_KEY = EXPO_PUBLIC_2GIS_API_KEY;
const PLACES_API_URL = 'https://catalog.api.2gis.com/3.0/items';

/**
 * Типизация для одного результата из 2GIS Places API
 */
export interface PlacesAPIResult {
	id: string;
	name: string;
	address_name?: string;
	full_name: string;
	type: string;
	point?: {
		lon: number;
		lat: number;
	};
}

/**
 * Типизация для ответа от 2GIS Places API
 */
export interface PlacesAPIResponse {
	meta: {
		api_version: string;
		code: number;
		issue_date: string;
		error?: {
			message: string;
			type: string;
		};
	};
	result?: {
		items: PlacesAPIResult[];
		total: number;
	};
}

/**
 * Выполняет поиск мест (геокодирование) через 2GIS Places API.
 * @param query - Поисковый запрос (адрес или название места).
 * @param location - Опциональные координаты [lon, lat] для уточнения поиска.
 * @param results - Количество результатов (по умолчанию 10).
 * @returns Promise с ответом от API или null в случае ошибки.
 */
export const geocodeAddress = async (
	query: string,
	location?: [number, number],
	results: number = 10,
): Promise<PlacesAPIResponse | null> => {
	if (!query.trim() || !API_KEY) {
		if (!API_KEY) {
			console.error('2GIS API Key is not provided!');
		}
		return null;
	}

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 10000);
	try {
		const params: Record<string, string> = {
			q: query,
			key: API_KEY,
			fields: 'items.point,items.address_name,items.full_name',
			page_size: String(results),
		};

		if (location) {
			params.location = `${location[0]},${location[1]}`;
		}

		const url = new URL(PLACES_API_URL);
		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.append(key, value);
		});

		const response = await fetch(url.toString(), {
			method: 'GET',
			signal: controller.signal,
		});

		const data = (await response.json()) as PlacesAPIResponse;
		if (data.meta.code === 200 && data.result) {
			return data;
		}
		console.warn(
			'2GIS geocoding response error:',
			data.meta.error?.message,
		);
		return { ...data, result: { items: [], total: 0 } };
	} catch (error) {
		console.error('Ошибка геокодирования 2GIS:', error);
		return null;
	} finally {
		clearTimeout(timeoutId);
	}
};
