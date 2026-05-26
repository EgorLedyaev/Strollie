import { useQuery } from '@tanstack/react-query';

import { citiesKeys, createQueryFn } from '@/shared/api';
import type { SelectOption } from '@/shared/ui';

import { getCities } from '../api/api';

const fetchCities = createQueryFn<SelectOption[]>(() => ({
	url: '/references/cities',
	method: 'GET',
}));

/**
 * Возвращает список доступных городов.
 * Пока серверный эндпоинт отсутствует, используем локальный мок,
 * но сам хук уже построен на TanStack Query и готов к подмене queryFn.
 */
export const useCitiesQuery = () =>
	useQuery({
		queryKey: citiesKeys.all,
		queryFn: async () => {
			try {
				return await fetchCities();
			} catch (error) {
				console.warn(
					'Cities API unavailable, falling back to mock data.',
					error,
				);
				return getCities();
			}
		},
		placeholderData: previousData => previousData,
		staleTime: 10 * 60 * 1000,
	});
