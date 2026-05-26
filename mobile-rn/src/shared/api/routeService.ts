// routeService.ts
import { AxiosError } from 'axios';

import axiosClient from './axios-client';

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
		const { data } = await axiosClient.post<RouteResponse>(
			normalizedUrl,
			requestData,
			{
				timeout: 30000, // Увеличенный таймаут для маршрутизации
			},
		);
		return data;
	} catch (error) {
		console.error('Error in buildOptimalRoute sending request:', error);
		if (error instanceof AxiosError) {
			const errorDetails = `Status: ${error.response?.status ?? 'unknown'}, Data: ${JSON.stringify(error.response?.data)}`;
			console.error('HTTP error details:', errorDetails);
			throw new Error(
				`Сервер маршрутизации вернул ошибку: ${errorDetails}`,
			);
		}
		throw new Error(
			'Не удалось построить маршрут: ' +
				(error instanceof Error ? error.message : String(error)),
		);
	}
}
