import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { router } from 'expo-router';
import { sessionAtom, SessionStorage } from '@/src/entities/session';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setSession = useSetAtom(sessionAtom);

  const loginWithEmail = async (email: string) => {
    if (!email.trim()) {
      setError('Введите email');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Проверяем, зарегистрирован ли пользователь
      const isRegistered = await SessionStorage.isUserRegistered(email);
      console.log(`Вход в систему с email: ${email}, зарегистрирован: ${isRegistered}`);
      
      if (!isRegistered) {
        setError('Пользователь не найден. Пожалуйста, зарегистрируйтесь.');
        return;
      }

      // Сохраняем email для использования на других экранах
      await SessionStorage.setEmail(email);
      await SessionStorage.setIsRegistration(false);
      
      // Загружаем профиль пользователя по email
      const userProfile = await SessionStorage.loadUserProfile(email);
      if (userProfile) {
        console.log(`Восстановлен профиль для ${email}:`, userProfile);
      } else {
        console.log(`Профиль для ${email} не найден, будет создан после верификации`);
      }
      
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
