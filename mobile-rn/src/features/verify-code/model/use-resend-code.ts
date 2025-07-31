import { useState } from 'react';

import { SessionStorage } from '@/src/entities/session';

export const useResendCode = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const resendCode = async () => {
		setIsLoading(true);
		setError(null);
		try {
			// Имитация API запроса для повторной отправки кода
			// В реальном приложении здесь будет вызов API
			// Здесь мы просто имитируем успешное выполнение
			return true;
		} catch (err) {
			console.error('Ошибка повторной отправки кода', err);
			setError('Не удалось отправить код повторно.');
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return { resendCode, isLoading, error };
};
