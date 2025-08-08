import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import { userApi } from '../api/api';
import type { User } from './user.model';

/**
 * Интерфейс для состояния профиля пользователя.
 * Содержит профиль пользователя, состояние загрузки и возможные ошибки.
 * @param {User | null} profile - Профиль пользователя или null, если не загружен.
 * @param {boolean} isLoading - Флаг, указывающий на то, что данные профиля загружаются.
 * @param {string | null} error - Сообщение об ошибке, если таковая имеется.
 */
interface UserProfileState {
	profile: User | null;
	isLoading: boolean;
	error: string | null;
}

/**
 * Начальное состояние профиля пользователя.
 * Изначально профиль не загружен, загрузка активна, ошибок нет.
 */
const INITIAL_STATE: UserProfileState = {
	profile: null,
	isLoading: true, // Изначально true, т.к. мы будем пытаться загрузить данные
	error: null,
};

/**
 * Создает хранилище для состояния профиля пользователя.
 * Используется для сохранения и восстановления состояния между запусками приложения.
 * @returns {JSONStorage<UserProfileState>} Хранилище для состояния профиля пользователя
 */
const storage = createJSONStorage<UserProfileState>(() => AsyncStorage);

// Атом с хранилищем. Он будет базой.
/**
 * Атом состояния профиля пользователя с поддержкой локального хранилища.
 * Используется для хранения и управления состоянием профиля пользователя в приложении.
 */
const userProfileAtomWithStorage = atomWithStorage(
	'user_profile',
	INITIAL_STATE,
	storage,
);


/**
 * Атом состояния профиля пользователя с поддержкой Suspense.
 * Используется для получения и управления состоянием профиля пользователя в приложении.
 */
export const userProfileAtom = atom(get => get(userProfileAtomWithStorage));

/**
 * Атом для загрузки профиля пользователя (write-only).
 * Используется для асинхронной загрузки данных профиля пользователя из API.
 * @param {string} email - Email пользователя, для которого загружается профиль.
 * @returns {Promise<void>} Промис, который разрешается после загрузки профиля
 */
export const loadUserProfileAtom = atom(
	null,
	async (get, set, email: string) => {
		set(userProfileAtomWithStorage, prev => ({
			...prev,
			isLoading: true,
			error: null,
		}));
		try {
			const userProfile = await userApi.loadUserProfile(email);
			if (!userProfile) {
				throw new Error('Профиль пользователя не найден.');
			}
			set(userProfileAtomWithStorage, {
				profile: userProfile,
				isLoading: false,
				error: null,
			});
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: 'Не удалось загрузить профиль.';
			set(userProfileAtomWithStorage, prev => ({
				...prev,
				isLoading: false,
				error: message,
			}));
		}
	},
);

/**
 * Атом для обновления профиля пользователя (write-only).
 * Используется для изменения данных профиля пользователя в приложении.
 * @param {User} updatedProfile - Обновленные данные профиля пользователя.
 * @returns {void} Не возвращает значение, обновляет состояние профиля пользователя
 */
export const updateUserProfileAtom = atom(
	null,
	(get, set, updatedProfile: User) => {
		set(userProfileAtomWithStorage, prev => ({
			...prev,
			profile: updatedProfile,
		}));
	},
);
