import { type User } from '@/src/shared/lib';
import { apiClient } from '@/src/shared/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API = {
	profile: `/user/`,
};

// Функция для загрузки профиля с сервера
export const fetchUserProfile = async (): Promise<User> => {
	// Получаем токен напрямую из AsyncStorage
	const tokenData = await AsyncStorage.getItem('auth:tokens');
	if (!tokenData) {
		throw new Error('Отсутствует токен авторизации');
	}

	const tokens = JSON.parse(tokenData);
	if (!tokens.refreshToken) {
		throw new Error('Отсутствует токен авторизации');
	}

	const { data } = await apiClient.get<{ data: User }>(API.profile, {
		headers: {
			Authorization: `Bearer ${tokens.refreshToken}`,
		},
	});

	return data.data;
};

// Функция для обновления профиля пользователя
export const updateUserProfile = async (profileData: Partial<User>): Promise<User> => {
	// Получаем токен напрямую из AsyncStorage
	const tokenData = await AsyncStorage.getItem('auth:tokens');
	if (!tokenData) {
		throw new Error('Отсутствует токен авторизации');
	}

	const tokens = JSON.parse(tokenData);
	if (!tokens.refreshToken) {
		throw new Error('Отсутствует токен авторизации');
	}

	const { data } = await apiClient.put<{ data: User }>(API.profile, profileData, {
		headers: {
			Authorization: `Bearer ${tokens.refreshToken}`,
		},
	});

	return data.data;
};
