import { router } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useState } from 'react';

import { sessionAtom, SessionStorage } from '@/src/entities/session';

export const useVerifyCode = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const setSession = useSetAtom(sessionAtom);

	const verifyCode = async (code: string) => {
		if (!code.trim()) {
			setError('Введите код');
			return false;
		}

		setIsLoading(true);
		setError(null);
		try {
			// Имитация API запроса для верификации кода
			// В реальном приложении здесь будет вызов API

			// Простая проверка: код должен быть 4 цифры
			if (code.length !== 4 || !/^\d{4}$/.test(code)) {
				setError('Неверный код подтверждения.');
				return false;
			}

			// Сохраняем токен и обновляем состояние сессии
			const mockToken = 'mock-token-' + Date.now();
			await SessionStorage.setToken(mockToken);
			setSession({ isAuthenticated: true, refreshToken: mockToken });

			// Проверяем, является ли это регистрацией
			const isRegistration = await SessionStorage.getIsRegistration();

			if (isRegistration) {
				router.push('/user-data');
			} else {
				router.push('/(app)');
			}

			return true;
		} catch (err) {
			console.error('Ошибка верификации кода', err);
			setError('Ошибка при проверке кода.');
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return { verifyCode, isLoading, error };
};
