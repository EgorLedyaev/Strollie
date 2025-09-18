import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';

import { updateUserProfileAtom, userProfileAtom } from '@/entities/user';

import { uploadAvatarApi } from '../api/upload-avatar-api';
import { pickImage } from '../lib/pick-image';
import { takePhoto } from '../lib/take-photo';

/**
 * [MODEL] Хук для управления процессом загрузки аватара.
 * Он оркестрирует взаимодействие между UI, lib (выбор файла) и api (загрузка на сервер),
 * а также управляет состоянием и обновляет глобальный стейт (entity).
 */
export const useUploadAvatar = () => {
	const profileState = useAtomValue(userProfileAtom);
	const updateUserProfile = useSetAtom(updateUserProfileAtom);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const commonFlow = async (imageUri: string | null): Promise<string | null> => {
		if (!imageUri) return null;
		// Шаг 2: Вызываем API для загрузки изображения (api)
		const uploadedUrl = await uploadAvatarApi(imageUri);
		if (!uploadedUrl) {
			throw new Error('Не удалось загрузить фото на сервер.');
		}
		// Шаг 3: Обновляем глобальное состояние (entity)
		if (profileState.profile) {
			const updatedProfile = {
				...profileState.profile,
				photo: uploadedUrl,
			};
			updateUserProfile(updatedProfile);
		}
		return uploadedUrl;
	};

	const uploadAvatar = async (): Promise<string | null> => {
		setIsLoading(true);
		setError(null);

		try {
			const imageUri = await pickImage();
			return await commonFlow(imageUri);
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: 'Произошла неизвестная ошибка.';
			setError(message);
			console.error('Ошибка в процессе загрузки аватара:', err);
			return null;
		} finally {
			setIsLoading(false);
		}
	};

	const takePhotoAndUpload = async (): Promise<string | null> => {
		setIsLoading(true);
		setError(null);
		try {
			const imageUri = await takePhoto();
			return await commonFlow(imageUri);
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: 'Произошла неизвестная ошибка.';
			setError(message);
			console.error('Ошибка в процессе съемки аватара:', err);
			return null;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		uploadAvatar,
		takePhoto: takePhotoAndUpload,
		isLoading,
		error,
		avatarUrl: profileState.profile?.photo,
	};
};
