import { useState } from 'react';
import { router } from 'expo-router';
import { useSetAtom } from 'jotai';
import { profileAtom } from '@/src/entities/user/model/user.state';

export interface UserInfo {
  sub: string;
  email?: string;
  preferred_username?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  birthdate?: string;
  nickname?: string;
  [key: string]: unknown;
}

export const useRegisterUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setProfile = useSetAtom(profileAtom);

  const register = async (userData: Partial<UserInfo>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Имитация API запроса для регистрации пользователя
      // В реальном приложении здесь будет вызов API
      
      // Обновляем профиль пользователя
      setProfile({
        profile: {
          user_id: 'user-' + Date.now(),
          email: userData.email || '',
          created_at: new Date().toISOString(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          nickname: userData.nickname,
          city: userData.city,
          birthDate: userData.birthdate,
        },
        isLoading: false,
        error: null
      });

      // Перенаправляем на главный экран приложения
      router.push('/(app)');
    } catch (err) {
      console.error('Ошибка регистрации пользователя', err);
      setError('Не удалось зарегистрировать пользователя.');
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};
