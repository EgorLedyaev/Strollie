import { useAtom, useSetAtom } from 'jotai';

import { userApi } from '@/entities/user';

import {
	authErrorAtom,
	authIsLoadingAtom,
	registrationStateAtom,
} from './state';

interface LoginCallbacks {
	onSuccess: () => void;
}

/**
 * Проверяет, зарегистрирован ли пользователь по email и запускает процесс входа.
 * @returns
 */
export const useLogin = () => {
	const [isLoading, setIsLoading] = useAtom(authIsLoadingAtom);
	const setError = useSetAtom(authErrorAtom);
	const setRegState = useSetAtom(registrationStateAtom);

	const loginWithEmail = async (email: string, { onSuccess }: LoginCallbacks) => {
		console.log(`Попытка входа с email: ${email} email trim is ${!email.trim()}`);
		
		if (!email.trim()) {
			setError('Введите email.');
			return;
		}

		setIsLoading(true);
		setError(null);
		try {
			// Шаг 1: Просто проверяем, есть ли такой пользователь в "базе данных".
			const isRegistered = await userApi.isUserRegistered(email);
			console.log(
				`Вход в систему с email: ${email}, зарегистрирован: ${isRegistered}`,
			);

			if (!isRegistered) {
				throw new Error(
					'Пользователь не найден. Пожалуйста, зарегистрируйтесь.',
				);
			}
			// Шаг 2: Сохраняем email в состояние фичи и помечаем, что это НЕ регистрация
			setRegState(prev => ({
				...prev,
				email,
				isRegistering: false, // Указываем, что это не регистрация
			}));

			// Шаг 3: Передаем управление наверх (странице), чтобы она сделала навигацию на экран верификации.
			onSuccess();
		} catch (err) {
			console.error('Ошибка входа', err);
			const message =
				err instanceof Error
					? err.message
					: 'Не удалось войти.';
			setError(message);
		} finally {
			setIsLoading(false);
		}
	};

	return { loginWithEmail, isLoading };
};
