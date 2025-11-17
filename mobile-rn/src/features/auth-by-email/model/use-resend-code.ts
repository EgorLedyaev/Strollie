import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';

import { requestOneTimeCode } from '@/shared/api';

import { registrationStateAtom } from './state';

interface UseResendCodeParams {
	email?: string;
}

export const useResendCode = (params?: UseResendCodeParams) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const registrationState = useAtomValue(registrationStateAtom);
	const targetEmail = useMemo(() => {
		if (params?.email) {
			return params.email.trim().toLowerCase();
		}
		return registrationState.email ?? '';
	}, [params?.email, registrationState.email]);

	const resendCode = async () => {
		if (!targetEmail) {
			setError('Не удалось определить email для повторной отправки.');
			return false;
		}
		setIsLoading(true);
		setError(null);
		try {
			await requestOneTimeCode(targetEmail);
			return true;
		} catch (err) {
			console.error('Ошибка повторной отправки кода', err);
			const message =
				err instanceof Error
					? err.message
					: 'Не удалось отправить код повторно.';
			setError(message);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return { resendCode, isLoading, error };
};
