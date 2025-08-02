import { useState } from 'react';

import { SessionStorage } from '@/src/entities/session';

interface LoginCallbacks {
	onSuccess: () => void;
	onError: (message: string) => void;
}

/**
 * Проверяет, зарегистрирован ли пользователь по email и запускает процесс входа.
 * @returns
 */
export const useLogin = () => {
	const [isLoading, setIsLoading] = useState(false);

	const loginWithEmail = async (email: string, callbacks: LoginCallbacks) => {
		if (!email.trim()) {
			callbacks.onError('Введите email');
			return;
		}

		setIsLoading(true);
		try {
			// Шаг 1: Просто проверяем, есть ли такой пользователь в "базе данных".
			const isRegistered = await SessionStorage.isUserRegistered(email);
			console.log(
				`Вход в систему с email: ${email}, зарегистрирован: ${isRegistered}`,
			);

			if (!isRegistered) {
				callbacks.onError(
					'Пользователь не найден. Пожалуйста, зарегистрируйтесь.',
				);
				return;
			}
			// Шаг 2: Если пользователь есть, мы просто сохраняем его email для следующего шага
			// и помечаем, что это не новый процесс регистрации.
			await SessionStorage.setEmail(email);
			await SessionStorage.setIsRegistration(false);

			const userProfile = await SessionStorage.loadUserProfile(email);
			if (userProfile) {
				console.log(`Восстановлен профиль для ${email}:`, userProfile);
			} else {
				console.log(
					`Профиль для ${email} не найден, будет создан после верификации`,
				);
			}

			// Шаг 3: Передаем управление наверх (странице), чтобы она сделала навигацию на экран верификации.
			callbacks.onSuccess();
		} catch (err) {
			console.error('Ошибка входа', err);
			const message =
				err instanceof Error
					? err.message
					: 'Не удалось отправить код.';
			callbacks.onError(message);
		} finally {
			setIsLoading(false);
		}
	};

	return { loginWithEmail, isLoading };
};
