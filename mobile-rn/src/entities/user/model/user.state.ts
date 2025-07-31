import { type User } from '@/src/shared/lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import { atom } from 'jotai';

import { API } from '@/src/entities/user/api/api';

export const profileAtom = atom<UserState>({
	profile: null,
	isLoading: false,
	error: null,
});

export const loadProfileAtom = atom(
	async get => {
		return get(profileAtom);
	},
	async (get, set) => {
		set(profileAtom, {
			profile: null,
			isLoading: true,
			error: null,
		});
		try {
			// Сначала пытаемся загрузить из AsyncStorage
			const storedProfile =
				await AsyncStorage.getItem('auth:userProfile');

			if (storedProfile) {
				const profileData = JSON.parse(storedProfile);
				console.log('Loaded profile from storage', profileData);
				set(profileAtom, {
					isLoading: false,
					profile: profileData,
					error: null,
				});
				return;
			}

			// Если нет в хранилище - пытаемся загрузить с сервера
			// Получаем токен напрямую из AsyncStorage
			const tokenData = await AsyncStorage.getItem('auth:tokens');
			if (!tokenData) {
				throw new Error('Отсутствует токен авторизации');
			}

			const tokens = JSON.parse(tokenData);
			if (!tokens.refreshToken) {
				throw new Error('Отсутствует токен авторизации');
			}

			const { data } = await axios.get<{ data: User }>(API.profile, {
				headers: {
					Authorization: `Bearer ${tokens.refreshToken}`,
				},
			});

			// Сохраняем в AsyncStorage
			await AsyncStorage.setItem(
				'auth:userProfile',
				JSON.stringify(data.data),
			);

			console.log('data from API', data);
			set(profileAtom, {
				isLoading: false,
				profile: data.data,
				error: null,
			});
		} catch (error) {
			console.error('Error loading profile', error);
			if (error instanceof AxiosError) {
				set(profileAtom, {
					isLoading: false,
					profile: null,
					error: error.response?.data?.message || error.message,
				});
			} else {
				set(profileAtom, {
					isLoading: false,
					profile: null,
					error:
						error instanceof Error
							? error.message
							: 'Неизвестная ошибка',
				});
			}
		}
	},
);

export interface UserState {
	profile: User | null;
	isLoading: boolean;
	error: string | null;
}
