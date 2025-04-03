// entities/auth/model/auth-context.tsx
import { KeycloakService } from '@/entities/auth/api/keycloak.service';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserInfo {
	sub: string;
	name?: string;
	email?: string;
	preferred_username?: string;

	[key: string]: unknown;
}

type AuthState = {
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	userInfo: UserInfo | null; // Добавляем данные пользователя
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
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
			const { accessToken } = await KeycloakService.getTokens();

			if (accessToken && accessToken !== 'null' && accessToken !== '') {
				setIsAuthenticated(true);
				// Получаем данные пользователя
				const userData = await KeycloakService.getUserInfo();
				setUserInfo(userData);
				console.log('checkAuth: Пользователь авторизован');
			} else {
				console.log('checkAuth: Токен отсутствует или пустой');
				setIsAuthenticated(false);
				setUserInfo(null);
			}
		} catch (err) {
			console.error('Ошибка проверки аутентификации', err);
			setIsAuthenticated(false);
			setUserInfo(null);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	const logout = async () => {
		try {
			await KeycloakService.logout();
			setIsAuthenticated(false);
			setUserInfo(null);
		} catch (err) {
			console.error('Ошибка выхода', err);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				isLoading,
				error,
				userInfo,
				logout,
				checkAuth,
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
