import { useMutation } from '@tanstack/react-query';

import type { RouteGenerationRequest } from '../model/types';
import { generateRoute } from './route-generation.service';

/**
 * React Query mutation для генерации маршрута.
 * Используется useMutation, т.к. это POST-запрос с побочным эффектом.
 */
export const useGenerateRouteMutation = () =>
	useMutation({
		mutationFn: (request: RouteGenerationRequest) => generateRoute(request),
	});
