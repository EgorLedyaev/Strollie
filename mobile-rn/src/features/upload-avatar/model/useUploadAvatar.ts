import { useState } from 'react';
import { useAtom } from 'jotai';
import * as ImagePicker from 'expo-image-picker';
import { profileAtom } from '@/src/entities/user';

export const useUploadAvatar = () => {
  const [profile, setProfile] = useAtom(profileAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async (): Promise<string | null> => {
    // Запрашиваем разрешение на доступ к медиатеке
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      setError('Разрешение на доступ к медиатеке не предоставлено');
      return null;
    }

    try {
      // Открываем медиатеку для выбора изображения
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        return selectedImage.uri;
      }
      
      return null;
    } catch (err) {
      setError('Произошла ошибка при выборе изображения');
      console.error('Error picking image:', err);
      return null;
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const imageUri = await pickImage();
      
      if (!imageUri) {
        return null;
      }
      
      // Здесь должен быть запрос к API для загрузки изображения
      // Пример: const response = await api.uploadImage(imageUri);
      
      // Имитация запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Обновляем локальные данные профиля с новым фото
      if (profile.profile) {
        const updatedProfile = {
          ...profile.profile,
          photo: imageUri
        };
        
        setProfile({
          ...profile,
          profile: updatedProfile
        });
      }
      
      return imageUri;
    } catch (err) {
      setError('Произошла ошибка при загрузке фото');
      console.error('Error uploading avatar:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadAvatar,
    isLoading,
    error,
    avatarUrl: profile.profile?.photo
  };
};
