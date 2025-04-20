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

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				isLoading,
				error,
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
