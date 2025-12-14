import { useQuery } from '@tanstack/react-query';

import { categoriesKeys } from '@/shared/api';

import { fetchCategories } from './category.service';

/**
 * React Query хук для получения списка категорий.
 * staleTime: Infinity — категории статичны и не меняются.
 */
export const useCategoriesQuery = () =>
	useQuery({
		queryKey: categoriesKeys.all,
		queryFn: fetchCategories,
		staleTime: Infinity,
	});
