// src/shared/api/geocoder.service.ts
import axios from 'axios';

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

	try {
		const params: any = {
			q: query,
			key: API_KEY,
			fields: 'items.point,items.address_name,items.full_name', // Запрашиваем необходимые поля
			page_size: results,
		};

		if (location) {
			params.location = `${location[0]},${location[1]}`; // lon,lat
		}

		const response = await axios.get<PlacesAPIResponse>(PLACES_API_URL, {
			params,
			timeout: 10000,
		});

		// Проверяем, что ответ успешный и содержит результаты
		if (response.data.meta.code === 200 && response.data.result) {
			return response.data;
		} else {
			console.warn(
				'2GIS geocoding response error:',
				response.data.meta.error?.message,
			);
			return { ...response.data, result: { items: [], total: 0 } }; // Возвращаем пустой результат при ошибке API
		}
	} catch (error) {
		console.error('Ошибка геокодирования 2GIS:', error);
		if (axios.isAxiosError(error) && error.response) {
			console.error('Данные ошибки:', error.response.data);
		}
		return null;
	}
};
