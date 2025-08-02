import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';

import { registrationStateAtom } from '@/src/features/auth-by-email';
import { sessionAtom, SessionStorage } from '@/src/entities/session';
import { profileAtom, type User } from '@/src/entities/user';

interface VerifyCodeCallbacks {
	onSuccess: () => void;
	onError: (message: string) => void;
}

export const useVerifyCode = () => {
	const [isLoading, setIsLoading] = useState(false);
	const setSession = useSetAtom(sessionAtom);
	const regState = useAtomValue(registrationStateAtom);
	const setProfile = useSetAtom(profileAtom);
	const setRegistrationState = useSetAtom(registrationStateAtom);

	const verifyCode = async (code: string, callbacks: VerifyCodeCallbacks) => {
		setIsLoading(true);
		try {
			if (code.length !== 4 || !/^\d{4}$/.test(code) || code !== '1234') {
				throw new Error('Неверный код подтверждения.');
			}

			const isRegistration = await SessionStorage.getIsRegistration();
			const email = await SessionStorage.getEmail();
			if (!email) {
				throw new Error('Сессия истекла, email не найден.');
			}

			if (isRegistration) {
				// Финализация регистрации: создаем профиль
				const userProfile: User = {
					user_id: 'user-' + Date.now(),
					email: email,
					created_at: new Date().toISOString(),
					firstName: regState.firstName || '',
					lastName: regState.lastName || '',
					nickname: regState.nickname || '',
					city: regState.city || '',
					birthDate: regState.birthdate || '',
				};
				await SessionStorage.addRegisteredUser(email);
				await SessionStorage.saveUserProfile(email, userProfile);
				setProfile({
					profile: userProfile,
					isLoading: false,
					error: null,
				});
				// Очищаем состояние регистрации после успеха
				setRegistrationState({});
			}

			// Создаем сессию в обоих случаях (логин и регистрация)
			const mockToken = 'mock-token-' + Date.now();
			await SessionStorage.setToken(mockToken);
			setSession({ isAuthenticated: true, refreshToken: mockToken });

			callbacks.onSuccess();
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: 'Ошибка при проверке кода.';
			callbacks.onError(message);
		} finally {
			setIsLoading(false);
		}
	};

	return { verifyCode, isLoading };
};
