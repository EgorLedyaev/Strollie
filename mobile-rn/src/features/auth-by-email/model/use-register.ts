import { router } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useState } from 'react';

import { sessionAtom, SessionStorage } from '@/src/entities/session';

export const useRegister = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const setSession = useSetAtom(sessionAtom);

	const registerEmail = async (email: string) => {
		if (!email.trim()) {
			setError('Введите email');
			return;
		}

		setIsLoading(true);
		setError(null);
		try {
			// Проверяем, не зарегистрирован ли уже пользователь
			const isAlreadyRegistered =
				await SessionStorage.isUserRegistered(email);

			if (isAlreadyRegistered) {
				setError(
					'Пользователь уже зарегистрирован. Войдите в аккаунт.',
				);
				return;
			}

			// Сохраняем email для использования на других экранах
			await SessionStorage.setEmail(email);
			await SessionStorage.setIsRegistration(true);
			router.push('/verify-code');
		} catch (err) {
			console.error('Ошибка регистрации', err);
			setError('Не удалось отправить код.');
		} finally {
			setIsLoading(false);
		}
	};

	return { registerEmail, isLoading, error };
};
