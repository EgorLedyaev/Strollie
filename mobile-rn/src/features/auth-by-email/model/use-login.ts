import { useAtom, useSetAtom } from 'jotai';

import { requestOneTimeCode } from '@/shared/api';

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

	const loginWithEmail = async (
		email: string,
		{ onSuccess }: LoginCallbacks,
	) => {
		const normalizedEmail = email.trim().toLowerCase();

		if (!normalizedEmail) {
			setError('Введите email.');
			return;
		}

		setIsLoading(true);
		setError(null);
		try {
			await requestOneTimeCode(normalizedEmail);
			setRegState(prev => ({
				...prev,
				email: normalizedEmail,
				isRegistering: false,
			}));
			onSuccess();
		} catch (err) {
			console.error('Ошибка входа', err);
			const message =
				err instanceof Error ? err.message : 'Не удалось войти.';
			setError(message);
		} finally {
			setIsLoading(false);
		}
	};

	return { loginWithEmail, isLoading };
};
