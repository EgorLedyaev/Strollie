// entities/auth/api/keycloak.service.ts
import { Colors } from '@/src/shared/tokens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	AuthSessionResult,
	CodeChallengeMethod,
	DiscoveryDocument,
	ResponseType,
	TokenResponse,
	exchangeCodeAsync,
	makeRedirectUri,
	useAuthRequest,
	useAutoDiscovery,
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { KEYCLOAK_CONFIG } from '../config';

// Ключи для AsyncStorage

// Ключи для AsyncStorage
const TOKEN_STORAGE_KEYS = {
	ACCESS_TOKEN: 'keycloak_access_token',
	REFRESH_TOKEN: 'keycloak_refresh_token',
	ID_TOKEN: 'keycloak_id_token',
};

// Закрываем сессию WebBrowser после авторизации
WebBrowser.maybeCompleteAuthSession();

export const getRedirectUri = () => {
	return makeRedirectUri({
		scheme: 'ru.strollie',
		// Для более надежной работы редиректов
		path: 'redirect',
	});
};

export function useKeycloakAuth() {
	const discovery = useAutoDiscovery(
		`${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}`,
	);
	const redirectUri = getRedirectUri();

	// Настройка авторизационного запроса
	const [request, response, promptAsync] = useAuthRequest(
		{
			clientId: KEYCLOAK_CONFIG.clientId,
			redirectUri,
			scopes: ['openid', 'profile', 'email'],
			usePKCE: true, // Обязательно используем PKCE для безопасности
			// Другие параметры для улучшения UX
			responseType: ResponseType.Code,
			codeChallengeMethod: CodeChallengeMethod.S256,
		},
		discovery,
	);

	const isReady = !!discovery && !!request;

	// Функция запуска авторизации с улучшенным UX
	const promptAuthAsync = async (): Promise<AuthSessionResult> => {
		if (!isReady) {
			throw new Error('Авторизация не готова');
		}

		// Параметры для улучшения UX с Custom Tabs
		return promptAsync({
			// Предотвращает переключение к другим приложениям в списке недавних (Android)
			showInRecents: false,

			...(Platform.OS === 'android'
				? {
						toolbarColor: Colors.green,
						presentation: 'popover', // Прозрачный фон для более "встроенного" вида
					}
				: {}),
		});
	};

	return {
		isReady,
		isInitializing: !isReady,
		discovery,
		request,
		response,
		promptAsync: promptAuthAsync,
	};
}

export async function exchangeCodeForTokens(
	code: string,
	codeVerifier: string,
	discovery: DiscoveryDocument | null,
): Promise<TokenResponse> {
	if (!discovery) {
		throw new Error('Discovery документ не доступен');
	}
	return exchangeCodeAsync(
		{
			clientId: KEYCLOAK_CONFIG.clientId,
			code,
			redirectUri: getRedirectUri(),
			extraParams: {
				code_verifier: codeVerifier,
			},
		},
		discovery,
	);
}

// Экспорт KeycloakService как объекта
export const KeycloakService = (() => {
	return {
		// Сохранение токенов
		saveTokens: async (tokens: TokenResponse) => {
			try {
				await AsyncStorage.multiSet([
					[TOKEN_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken || ''],
					[
						TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
						tokens.refreshToken || '',
					],
					[TOKEN_STORAGE_KEYS.ID_TOKEN, tokens.idToken || ''],
				]);
				return true;
			} catch (error) {
				console.error('Ошибка при сохранении токенов', error);
				return false;
			}
		},

		// Получение токенов
		getTokens: async () => {
			try {
				const tokens = await AsyncStorage.multiGet([
					TOKEN_STORAGE_KEYS.ACCESS_TOKEN,
					TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
					TOKEN_STORAGE_KEYS.ID_TOKEN,
				]);

				const accessToken = tokens[0][1] || null;
				const refreshToken = tokens[1][1] || null;
				const idToken = tokens[2][1] || null;

				console.log('getTokens: получен accessToken:', !!accessToken);

				return {
					accessToken,
					refreshToken,
					idToken,
				};
			} catch (error) {
				console.error('Ошибка при получении токенов', error);
				return { accessToken: null, refreshToken: null, idToken: null };
			}
		},

		// Получение информации о пользователе из идентификационного токена
		getUserInfo: async () => {
			const { idToken } = await KeycloakService.getTokens();
			if (!idToken) return null;

			try {
				// Декодирование JWT без библиотек
				const payload = idToken.split('.')[1];
				const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
				const jsonPayload = decodeURIComponent(
					atob(base64)
						.split('')
						.map(
							c =>
								'%' +
								('00' + c.charCodeAt(0).toString(16)).slice(-2),
						)
						.join(''),
				);

				return JSON.parse(jsonPayload);
			} catch (error) {
				console.error(
					'Ошибка при получении информации пользователя',
					error,
				);
				return null;
			}
		},

		// Выход пользователя
		logout: async () => {
			// Сначала получаем токены до их удаления
			const { idToken } = await KeycloakService.getTokens();

			// Удаляем локальные токены
			try {
				await AsyncStorage.multiRemove([
					TOKEN_STORAGE_KEYS.ACCESS_TOKEN,
					TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
					TOKEN_STORAGE_KEYS.ID_TOKEN,
				]);

				// Если есть ID токен, делаем запрос на выход и у Keycloak сервера
				if (idToken) {
					const logoutUrl = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/logout`;
					await fetch(
						`${logoutUrl}?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(KEYCLOAK_CONFIG.redirectUri)}`,
					);
				}

				console.log('Выход выполнен успешно, токены удалены');
				return true;
			} catch (error) {
				console.error('Ошибка при выходе', error);
				return false;
			}
		},
	};
})();
