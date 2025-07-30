import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { router } from 'expo-router';
import { sessionAtom } from '@/src/entities/session/model/session.state';
import { SessionStorage } from '@/src/entities/session/model/session-storage';

export const useVerifyCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setSession = useSetAtom(sessionAtom);

  const verifyCode = async (code: string) => {
    if (!code.trim()) return false;

    setIsLoading(true);
    setError(null);
    try {
      // Имитация API запроса для верификации кода
      // В реальном приложении здесь будет вызов API

      // Сохраняем токен и обновляем состояние сессии
      const mockToken = 'mock-token-' + Date.now();
      await SessionStorage.setToken(mockToken);
      setSession({ isAuthenticated: true, refreshToken: mockToken });
      
      // Проверяем, является ли это регистрацией
      const isRegistration = await SessionStorage.getIsRegistration();
      
      if (isRegistration) {
        router.push('/user-data');
      } else {
        router.push('/(app)');
      }
      
      return true;
    } catch (err) {
      console.error('Ошибка верификации кода', err);
      setError('Неверный код подтверждения.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { verifyCode, isLoading, error };
};
