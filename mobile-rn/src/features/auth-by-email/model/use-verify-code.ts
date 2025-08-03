import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';

import { setSessionAtom } from '@/src/entities/session';
import { userApi, type User } from '@/src/entities/user';

import { registrationStateAtom, verifyCodeErrorAtom } from './state';

interface VerifyCodeCallbacks {
	onSuccess: () => void;
}

export const useVerifyCode = () => {
	const [isLoading, setIsLoading] = useState(false);
	const setSession = useSetAtom(setSessionAtom);
	const regState = useAtomValue(registrationStateAtom);
	const setRegState = useSetAtom(registrationStateAtom);
	const setError = useSetAtom(verifyCodeErrorAtom);

	const verifyCode = async (
		code: string,
		{ onSuccess }: VerifyCodeCallbacks,
	) => {
		setIsLoading(true);
		try {
			// В реальном API мы бы отправили { email, code } и получили бы токен и профиль
			if (code.length !== 4 || !/^\d{4}$/.test(code) || code !== '1234') {
				throw new Error('Неверный код подтверждения.');
			}

			if (!regState.email) {
				throw new Error('Сессия истекла, email не найден.');
			}

			let userProfile: User | null;
			const mockToken = 'mock-refresh-token-' + Date.now();

			if (regState.isRegistering) {
				// Финализация регистрации: создаем профиль
				const newUser: User = {
					user_id: 'user-' + Date.now(),
					email: regState.email,
					created_at: new Date().toISOString(),
					firstName: regState.firstName || '',
					lastName: regState.lastName || '',
					nickname: regState.nickname || '',
					city: regState.city || '',
					birthDate: regState.birthdate || '',
				};
				userProfile = await userApi.saveUserProfile(newUser);
			} else {
				// Вход существующего пользователя: загружаем профиль
				userProfile = await userApi.loadUserProfile(regState.email);
			}

			if (!userProfile) {
				throw new Error('Не удалось получить данные пользователя.');
			}

			// Устанавливаем сессию
			setSession({ refreshToken: mockToken, userProfile });

			// Очищаем состояние регистрации
			setRegState({ isRegistering: false });
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
