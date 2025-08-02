import { useState } from 'react';
import { useAtom } from 'jotai';
import { profileAtom, User } from '@/src/entities/user';

interface EditProfileParams {
  firstName?: string;
  lastName?: string;
  nickname?: string;
  city?: string;
  birthDate?: string;
  email?: string;
}

export const useEditProfile = () => {
  const [profile, setProfile] = useAtom(profileAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: EditProfileParams): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Здесь должен быть запрос к API для сохранения данных профиля
      // Пример: const response = await api.updateProfile(data);
      
      // Имитация запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Обновляем локальные данные профиля
      if (profile.profile) {
        const updatedProfile: User = {
          ...profile.profile,
          ...data
        };
        
        setProfile({
          ...profile,
          profile: updatedProfile
        });
      }
      
      return true;
    } catch (err) {
      setError('Произошла ошибка при сохранении профиля');
      console.error('Error updating profile:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading,
    error,
    profile
  };
};
