// routeService.ts
import axios from 'axios';

import apiClient from './client';

export interface RouteRequestData {
	startPoint: { lon: number; lat: number };
	waypoints: Array<{ lon: number; lat: number }>;
	apiKey?: string;
}

export interface RouteResponse {
	coordinates: Array<{ lon: number; lat: number }>;
	distance?: number;
	duration?: number;
	error?: string;
}

export interface ValhallaRouteRequest {
	locations: Array<{
		lat: number;
		lon: number;
		type?: string /*...и другие опции...*/;
	}>;
	costing: 'auto' | 'pedestrian' | 'bicycle' | 'multimodal' | string; // Добавь нужные типы
	costing_options?: Record<string, unknown>;
	units?: 'kilometers' | 'miles';
	id?: string;
	// ... другие возможные опции Valhalla ...
}

export async function buildOptimalRoute(
	requestData: ValhallaRouteRequest,
): Promise<RouteResponse> {
	const routeBuilderUrl = process.env.EXPO_PUBLIC_ROUTE_API;

	if (!routeBuilderUrl) {
		throw new Error('URL построителя маршрутов не задан');
	}

	const normalizedUrl = routeBuilderUrl.startsWith('http')
		? routeBuilderUrl
		: `http://${routeBuilderUrl}/route/calculate`;

	try {
		const { data } = await apiClient.post<RouteResponse>(
			normalizedUrl,
			requestData,
			{
				timeout: 30000, // Увеличенный таймаут для маршрутизации
			},
		);
		return data;
	} catch (error) {
		console.error('Error in buildOptimalRoute sending request:', error);
		if (axios.isAxiosError(error)) {
			const errorDetails = error.response
				? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`
				: 'No response received';
			console.error('Axios error details:', errorDetails);
			throw new Error(
				`Сервер маршрутизации вернул ошибку: ${errorDetails}`,
			);
		} else {
			throw new Error(
				'Не удалось построить маршрут: ' +
					(error instanceof Error ? error.message : String(error)),
			);
		}
	}
}
