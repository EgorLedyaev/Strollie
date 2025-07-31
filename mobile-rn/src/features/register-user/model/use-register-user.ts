import { router } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useState } from 'react';

import { sessionAtom, SessionStorage } from '@/src/entities/session';
import { profileAtom, type User } from '@/src/entities/user';

export interface UserInfo {
	sub: string;
	email?: string;
	preferred_username?: string;
	firstName?: string;
	lastName?: string;
	city?: string;
	birthdate?: string;
	nickname?: string;
	[key: string]: unknown;
}

export const useRegisterUser = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const setProfile = useSetAtom(profileAtom);
	const setSession = useSetAtom(sessionAtom);

	const register = async (userData: Partial<UserInfo>) => {
		setIsLoading(true);
		setError(null);
		try {
			// Получаем email из хранилища
			const email = await SessionStorage.getEmail();

			if (!email) {
				throw new Error('Email не найден');
			}

			// Обязательно сохраняем email в локальном хранилище для последующей авторизации
			await SessionStorage.addRegisteredUser(email);

			// Логируем для отладки
			console.log('Регистрируем пользователя с email:', email);
			const registeredUsers = await SessionStorage.getRegisteredUsers();
			console.log(
				'Текущие зарегистрированные пользователи:',
				registeredUsers,
			);

			// Создаем профиль пользователя
			const userProfile: User = {
				user_id: 'user-' + Date.now(),
				email: email,
				created_at: new Date().toISOString(),
				firstName: userData.firstName || '',
				lastName: userData.lastName || '',
				nickname: userData.nickname || '',
				city: userData.city || '',
				birthDate: userData.birthdate || '',
				aboutMe: (userData.aboutMe as string) || '',
			};

			// Сохраняем профиль пользователя в хранилище
			await SessionStorage.saveUserProfile(email, userProfile);

			// Обновляем атом профиля
			setProfile({
				profile: userProfile,
				isLoading: false,
				error: null,
			});

			// Устанавливаем сессию как авторизованную
			setSession({
				isAuthenticated: true,
				refreshToken: 'mock-token-' + Date.now(),
			});

			// Перенаправляем на главный экран приложения
			router.push('/(app)');
		} catch (err) {
			console.error('Ошибка регистрации пользователя', err);
			setError('Не удалось зарегистрировать пользователя.');
		} finally {
			setIsLoading(false);
		}
	};

	return { register, isLoading, error };
};
