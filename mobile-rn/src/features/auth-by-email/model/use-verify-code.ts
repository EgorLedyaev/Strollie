import { formatISO } from 'date-fns';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';

import { setSessionAtom } from '@/entities/session';
import { userApi, type User } from '@/entities/user';
import { verifyOneTimeCode } from '@/shared/api';
import { OTP_CODE_LENGTH } from '@/shared/config';

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
		setError(null);
		try {
			const normalizedCode = code.trim();
			const codePattern = new RegExp(`^\\d{${OTP_CODE_LENGTH}}$`);
			if (!codePattern.test(normalizedCode)) {
				throw new Error(
					`Введите ${OTP_CODE_LENGTH}-значный код подтверждения.`,
				);
			}

			if (!regState.email) {
				throw new Error('Сессия истекла, email не найден.');
			}

			const tokens = await verifyOneTimeCode({
				email: regState.email,
				code: normalizedCode,
			});

			let userProfile: User | null = null;
			if (regState.isRegistering) {
				const newUser: User = {
					user_id: regState.email,
					email: regState.email,
					created_at: formatISO(new Date()),
					firstName: regState.firstName || '',
					lastName: regState.lastName || '',
					nickname: regState.nickname || '',
					city: regState.city || '',
					birthDate: regState.birthdate || '',
				};
				userProfile = await userApi.saveUserProfile(newUser);
			} else {
				userProfile = await userApi.loadUserProfile(regState.email);
			}

			if (!userProfile) {
				throw new Error('Не удалось получить данные пользователя.');
			}

			setSession({
				accessToken: tokens.access_token,
				refreshToken: tokens.refresh_token,
				tokenType: tokens.token_type,
				userProfile,
			});

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
