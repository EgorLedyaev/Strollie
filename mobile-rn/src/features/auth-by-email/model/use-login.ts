import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { router } from 'expo-router';
import { sessionAtom } from '@/src/entities/session/model/session.state';
import { SessionStorage } from '@/src/entities/session/model/session-storage';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setSession = useSetAtom(sessionAtom);

  const loginWithEmail = async (email: string) => {
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      // Имитация API запроса для отправки кода
      await SessionStorage.setIsRegistration(false);
      router.push('/verify-code');
    } catch (err) {
      console.error('Ошибка входа', err);
      setError('Не удалось отправить код.');
    } finally {
      setIsLoading(false);
    }
  };

  return { loginWithEmail, isLoading, error };
};
