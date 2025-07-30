import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthStorage } from './auth-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

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

type AuthState = {
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	userInfo: UserInfo | null;
	loginWithEmail: (email: string) => Promise<void>;
	registerEmail: (email: string) => Promise<void>;
	verifyCode: (code: string) => Promise<boolean>;
	register: (userData: Partial<UserInfo>) => Promise<void>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
	resendCode: () => Promise<void>;
	updateProfile: (profile: Partial<UserInfo>) => Promise<void>;
	isRegistrationFlow: () => Promise<boolean>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	const checkAuth = async () => {
		try {
			setIsLoading(true);
			const tokens = await AuthStorage.getTokens();
			const storedUserInfo = await AuthStorage.getUserInfo();

			if (tokens?.accessToken) {
				setIsAuthenticated(true);
				if (storedUserInfo) {
					setUserInfo(storedUserInfo);
				}
			} else {
				console.log('checkAuth: Токен отсутствует или пустой');
				setIsAuthenticated(false);
			}
		} catch (err) {
			console.error('Ошибка проверки аутентификации', err);
			setIsAuthenticated(false);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	const logout = async () => {
		try {
			// Очищаем все данные аутентификации
			await AuthStorage.clearAll();
			
			// Очищаем временные данные
			await AsyncStorage.removeItem('temp_email');
			await AsyncStorage.removeItem('is_registration');
			
			// Сбрасываем состояние
			setIsAuthenticated(false);
			setUserInfo(null);
			
			console.log('Выход из аккаунта выполнен успешно');
			
			// После успешного выхода и очистки данных
			// Нужно перенаправить на экран входа
			// Используем router напрямую без setTimeout
			router.replace('/sign-in');
		} catch (err) {
			console.error('Ошибка выхода', err);
			// При ошибке всё равно пытаемся перенаправить пользователя
			router.replace('/sign-in');
		}
	};

	const loginWithEmail = async (email: string) => {
		try {
			setIsLoading(true);
			setError(null);
			console.log(`Отправка кода подтверждения на ${email}`);
			// Здесь будет API-вызов для отправки кода подтверждения
			
			// Сохраняем email во временное хранилище для дальнейшего использования
			await AsyncStorage.setItem('temp_email', email);
			
			// Явно устанавливаем флаг, что это НЕ регистрация
			await AsyncStorage.removeItem('is_registration');
			
			// Временная имитация отправки кода
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			return Promise.resolve();
		} catch (err) {
			console.error('Ошибка при отправке кода подтверждения', err);
			setError('Ошибка при отправке кода. Пожалуйста, попробуйте снова.');
			return Promise.reject(err);
		} finally {
			setIsLoading(false);
		}
	};

	const verifyCode = async (code: string) => {
		try {
			setIsLoading(true);
			setError(null);
			console.log(`Проверка кода: ${code}`);
			// Здесь будет API-вызов для проверки кода
			
			// Временная имитация проверки кода
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Временная заглушка для демонстрации
			if (code === '1234') {
				// Эмуляция получения токена
				const tokens = {
					accessToken: 'fake-access-token-' + Date.now(),
					refreshToken: 'fake-refresh-token-' + Date.now()
				};
				
				// Используем email из временного хранилища или устанавливаем значение по умолчанию
				const tempEmail = await AsyncStorage.getItem('temp_email');
				const email = tempEmail || 'user@example.com';
				
				// Проверяем, это регистрация или вход
				const isRegistration = await AsyncStorage.getItem('is_registration');
				
				// Если это вход, то проверяем есть ли сохраненный профиль
				let savedUserInfo = null;
				if (isRegistration !== 'true') {
					savedUserInfo = await AuthStorage.getUserInfo();
				}
				
				// Создаем данные пользователя
				const userInfoData = savedUserInfo || { 
					sub: 'temp-user-id', 
					email: email 
				};
				
				// Сохраняем токены и данные пользователя
				await AuthStorage.saveTokens(tokens);
				await AuthStorage.saveUserInfo(userInfoData);
				
				// Важно: не очищаем маркер is_registration здесь,
				// чтобы на странице верификации кода корректно определялся тип потока
				// Маркер будет очищен после завершения заполнения данных пользователя
				
				setIsAuthenticated(true);
				setUserInfo(userInfoData);
				return true;
			}
			
			setError('Неверный код подтверждения');
			return false;
		} catch (err) {
			console.error('Ошибка при проверке кода', err);
			setError('Ошибка при проверке кода. Пожалуйста, попробуйте снова.');
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const resendCode = async () => {
		try {
			setIsLoading(true);
			setError(null);
			console.log('Повторная отправка кода подтверждения');
			// Здесь будет API-вызов для повторной отправки кода
			
			// Временная имитация отправки кода
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			return Promise.resolve();
		} catch (err) {
			console.error('Ошибка при повторной отправке кода', err);
			setError('Ошибка при отправке кода. Пожалуйста, попробуйте снова.');
			return Promise.reject(err);
		} finally {
			setIsLoading(false);
		}
	};
	
	const registerEmail = async (email: string) => {
		try {
			setIsLoading(true);
			setError(null);
			console.log(`Отправка кода подтверждения для регистрации на ${email}`);
			// Здесь будет API-вызов для отправки кода подтверждения при регистрации
			
			// Сохраняем email во временное хранилище для дальнейшего использования
			await AsyncStorage.setItem('temp_email', email);
			await AsyncStorage.setItem('is_registration', 'true'); // Маркер, что это регистрация
			
			// Временная имитация отправки кода
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			return Promise.resolve();
		} catch (err) {
			console.error('Ошибка при отправке кода подтверждения', err);
			setError('Ошибка при отправке кода. Пожалуйста, попробуйте снова.');
			return Promise.reject(err);
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (userData: Partial<UserInfo>) => {
		try {
			setIsLoading(true);
			setError(null);
			
			// Здесь будет интеграция с API регистрации
			// Временная имитация успешной регистрации
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Генерируем токены для эмуляции успешной регистрации
			const tokens = {
				accessToken: 'fake-access-token-' + Date.now(),
				refreshToken: 'fake-refresh-token-' + Date.now()
			};
			
			// Формируем данные пользователя
			const userInfoData = {
				sub: '123',
				...userData,
				email: userData.email || userInfo?.email || 'user@example.com',
			};
			
			// Сохраняем токены и данные пользователя
			await AuthStorage.saveTokens(tokens);
			await AuthStorage.saveUserInfo(userInfoData);
			
			// Сохраняем базовый профиль в хранилище профилей
			const userProfile = {
				user_id: '123',
				email: userData.email || userInfo?.email || 'user@example.com',
				created_at: new Date().toISOString(),
				firstName: userData.firstName,
				lastName: userData.lastName,
				middleName: '', // Добавляем пустое значение для middleName
				city: userData.city,
				birthDate: userData.birthdate,
				nickname: userData.nickname,
				aboutMe: '',
			};
			
			await AuthStorage.saveUserProfile(userProfile);
			
			// Теперь очищаем маркер is_registration после успешной регистрации
			await AsyncStorage.removeItem('is_registration');
			
			setIsAuthenticated(true);
			setUserInfo(userInfoData);
		} catch (err) {
			console.error('Ошибка регистрации', err);
			setError('Ошибка при регистрации. Попробуйте еще раз.');
			throw err;
		} finally {
			setIsLoading(false);
		}
	};
	
	const updateProfile = async (profile: Partial<UserInfo>) => {
		try {
			setIsLoading(true);
			setError(null);
			
			if (!userInfo) {
				throw new Error("Пользователь не авторизован");
			}
			
			const updatedUserInfo = {
				...userInfo,
				...profile
			};
			
			// Сохраняем обновленные данные пользователя
			await AuthStorage.saveUserInfo(updatedUserInfo);
			
			// Получаем текущий профиль из хранилища
			const currentProfile = await AuthStorage.getUserProfile();
			if (currentProfile) {
				// Обновляем профиль с новыми данными
				const updatedProfile = {
					...currentProfile,
					firstName: profile.firstName || currentProfile.firstName,
					lastName: profile.lastName || currentProfile.lastName,
					city: profile.city || currentProfile.city,
					birthDate: profile.birthdate || currentProfile.birthDate,
				};
				
				await AuthStorage.saveUserProfile(updatedProfile);
			}
			
			setUserInfo(updatedUserInfo);
			return Promise.resolve();
		} catch (err) {
			console.error('Ошибка при обновлении профиля', err);
			setError('Ошибка при обновлении профиля. Попробуйте еще раз.');
			return Promise.reject(err);
		} finally {
			setIsLoading(false);
		}
	};
	
	const isRegistrationFlow = async (): Promise<boolean> => {
		try {
			const isRegistration = await AsyncStorage.getItem('is_registration');
			console.log('isRegistrationFlow проверка:', isRegistration === 'true' ? 'Это регистрация' : 'Это вход');
			return isRegistration === 'true';
		} catch (err) {
			console.error('Ошибка при проверке типа авторизации', err);
			return false;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				isLoading,
				error,
				userInfo,
				loginWithEmail,
				registerEmail,
				verifyCode,
				register,
				logout,
				checkAuth,
				resendCode,
				updateProfile,
				isRegistrationFlow,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth должен использоваться внутри AuthProvider');
	}
	return context;
};
