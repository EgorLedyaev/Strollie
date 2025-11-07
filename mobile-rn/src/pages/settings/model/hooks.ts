import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { sessionAtom, setSessionAtom } from '@/entities/session';
import { userApi } from '@/entities/user';

import {
	changeEmailIsLoadingAtom,
	newEmailAtom,
	requestChangeErrorAtom,
	verifyChangeErrorAtom,
} from './atoms';

/**
 * Хук для запроса смены email.
 * Проверяет email и инициирует отправку кода.
 */
export const useRequestEmailChange = () => {
	const [newEmail, setNewEmail] = useAtom(newEmailAtom);
	const [isLoading, setIsLoading] = useAtom(changeEmailIsLoadingAtom);
	const [error, setError] = useAtom(requestChangeErrorAtom);

	const requestChange = async ({ onSuccess }: { onSuccess: () => void }) => {
		setIsLoading(true);
		setError(null);

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!newEmail || !newEmail.trim() || !emailRegex.test(newEmail)) {
			setError('Введите корректный email');
			setIsLoading(false);
			return;
		}

		try {
			const isAlreadyRegistered =
				await userApi.isUserRegistered(newEmail);
			if (isAlreadyRegistered) {
				setError('Этот email уже используется другим аккаунтом.');
				setIsLoading(false);
				return;
			}

			console.log(`Отправляем код подтверждения на ${newEmail}`);
			await new Promise(resolve => setTimeout(resolve, 1000));

			onSuccess();
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Произошла ошибка.';
			setError(message);
		} finally {
			setIsLoading(false);
		}
	};

	return { newEmail, setNewEmail, requestChange, isLoading, error, setError };
};

/**
 * Хук для верификации кода и завершения смены email.
 */
export const useVerifyEmailChange = () => {
	const [isLoading, setIsLoading] = useAtom(changeEmailIsLoadingAtom);
	const setError = useSetAtom(verifyChangeErrorAtom);
	const newEmail = useAtomValue(newEmailAtom);
	const setSession = useSetAtom(setSessionAtom);
	const currentSession = useAtomValue(sessionAtom);

	const verifyCode = async (
		code: string,
		{ onSuccess }: { onSuccess: () => void },
	) => {
		setIsLoading(true);
		setError(null);

		if (code !== '1234') {
			setError('Неверный код подтверждения.');
			setIsLoading(false);
			return;
		}
		if (!currentSession?.userProfile || !currentSession.refreshToken) {
			setError('Не удалось обновить email: сессия не найдена.');
			setIsLoading(false);
			return;
		}

		try {
			const newSessionData = {
				refreshToken: currentSession.refreshToken,
				userProfile: {
					...currentSession.userProfile,
					email: newEmail,
				},
			};

			setSession(newSessionData);

			console.log(`Email успешно изменен на ${newEmail}`);
			onSuccess();
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: 'Ошибка при проверке кода.';
			setError(message);
		} finally {
			setIsLoading(false);
		}
	};

	return { verifyCode, isLoading };
};
