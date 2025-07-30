import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { isAuthenticatedAtom, sessionAtom } from '@/src/entities/session';

export const useAuthCheck = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const setSession = useSetAtom(sessionAtom);
  
  const checkAuth = async () => {
    try {
      // В будущем здесь можно добавить проверку токена с сервером
      return isAuthenticated;
    } catch (error) {
      console.error('Ошибка при проверке авторизации', error);
      return false;
    }
  };

  return {
    isAuthenticated,
    checkAuth,
    isLoading: false, // можно добавить состояние загрузки, если необходимо
  };
};
