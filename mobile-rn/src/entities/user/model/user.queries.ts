import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
	AppError,
	createMutationFn,
	createQueryFn,
	queryKeys,
} from '@/shared/api';

import { userApi } from '../api/api';
import type { User } from './user.model';

const fetchProfileRequest = createQueryFn<User>(() => ({
	url: '/profile/me',
	method: 'GET',
}));

const updateProfileRequest = createMutationFn<User, User>(payload => ({
	url: '/profile/me',
	method: 'PUT',
	data: payload,
}));

export const useUserProfileQuery = (email?: string | null) => {
	return useQuery({
		queryKey: queryKeys.session.profile(),
		enabled: Boolean(email),
		queryFn: async () => {
			if (!email) {
				throw new AppError('Email отсутствует в сессии');
			}
			try {
				return await fetchProfileRequest();
			} catch (error) {
				const localProfile = await userApi.loadUserProfile(email);
				if (!localProfile) {
					throw error;
				}
				console.warn(
					'Сетевой профиль недоступен, используем локальный из AsyncStorage.',
					error,
				);
				return localProfile;
			}
		},
		placeholderData: previous => previous,
		staleTime: 5 * 60 * 1000,
	});
};

export const useUpdateUserProfileMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: User) => {
			try {
				return await updateProfileRequest(payload);
			} catch (error) {
				console.warn(
					'Не удалось обновить профиль на сервере, сохраняем локально.',
					error,
				);
				return userApi.saveUserProfile(payload);
			}
		},
		onSuccess: data => {
			queryClient.setQueryData(queryKeys.session.profile(), data);
		},
	});
};
