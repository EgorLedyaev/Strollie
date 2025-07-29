import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserInfo {
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
			const accessToken = true;

			if (accessToken) {
				setIsAuthenticated(true);
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
			setIsAuthenticated(false);
			setUserInfo(null);
		} catch (err) {
			console.error('Ошибка выхода', err);
		}
	};

	const loginWithEmail = async (email: string) => {
		try {
			setIsLoading(true);
			setError(null);
			console.log(`Отправка кода подтверждения на ${email}`);
			// Здесь будет API-вызов для отправки кода подтверждения
			
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
				setIsAuthenticated(true);
				setUserInfo({ sub: 'temp-user-id', email: 'user@example.com' });
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
			
			setIsAuthenticated(true);
			setUserInfo({
				sub: '123',
				...userData
			});
		} catch (err) {
			console.error('Ошибка регистрации', err);
			setError('Ошибка при регистрации. Попробуйте еще раз.');
			throw err;
		} finally {
			setIsLoading(false);
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
