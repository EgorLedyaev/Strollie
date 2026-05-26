import { routesAxiosClient } from '@/shared/api';

import type {
	RouteGenerationRequest,
	RouteGenerationResponse,
} from '../model/types';

/**
 * Сгенерировать маршрут через AI.
 * Timeout увеличен до 30 секунд из-за длительности генерации.
 */
export async function generateRoute(
	request: RouteGenerationRequest,
): Promise<RouteGenerationResponse> {
	console.log('[routes][generateRoute][request]', request);
	const response = await routesAxiosClient.post<RouteGenerationResponse>(
		'/api/routes/generate',
		request,
	);
	console.log('[routes][generateRoute][response]', response.data);
	return response.data;
}
