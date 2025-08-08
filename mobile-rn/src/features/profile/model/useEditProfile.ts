import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';

import {
	updateUserProfileAtom,
	User,
	userApi,
	userProfileAtom,
} from '@/entities/user';

export type UserProfileData = Omit<User, 'user_id' | 'created_at' | 'email'>;

export const useEditProfile = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { profile: currentProfile } = useAtomValue(userProfileAtom);
	const updateUserInGlobalState = useSetAtom(updateUserProfileAtom);

	const saveProfile = async (data: UserProfileData): Promise<boolean> => {
		if (!currentProfile) {
			setError('Не удалось найти текущий профиль для обновления.');
			return false;
		}

		setIsLoading(true);
		setError(null);

		try {
			const updatedProfileData: User = {
				...currentProfile,
				...data,
			};

			// 1. Отправляем на "сервер"
			const savedProfile =
				await userApi.saveUserProfile(updatedProfileData);

			// 2. Обновляем профиль в глобальном состоянии
			updateUserInGlobalState(savedProfile);

			console.log('Профиль успешно сохранен');
			return true;
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: 'Произошла ошибка при сохранении профиля';
			setError(message);
			console.error('Error updating profile:', err);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		saveProfile,
		isLoading,
		error,
	};
};
