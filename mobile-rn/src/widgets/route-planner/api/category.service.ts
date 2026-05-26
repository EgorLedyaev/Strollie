import { routesAxiosClient } from '@/shared/api';

import type { CategoriesResponse } from '../model/category/types';

/**
 * Получить список доступных категорий для генерации маршрута.
 */
export async function fetchCategories(): Promise<CategoriesResponse> {
	const response =
		await routesAxiosClient.get<CategoriesResponse>('/api/categories');
	return response.data;
}
