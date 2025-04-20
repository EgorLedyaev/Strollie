import {
	KeycloakService,
	exchangeCodeForTokens,
	useKeycloakAuth,
} from '@/src/entities/auth/api/keycloak.service';
import { useAuth } from '@/src/entities/auth/model/auth-context';
import { AppButton } from '@/src/shared/Button/AppButton';
import { Colors } from '@/src/shared/tokens';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { KEYCLOAK_CONFIG } from '../src/entities/auth/config';

export default function LoginScreen() {
	const { isReady, discovery, request, response, promptAsync } =
		useKeycloakAuth();
	const { checkAuth } = useAuth();

	const [authError, setAuthError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const redirectInProgress = useRef(false);

	useEffect(() => {
		// Проверяем состояние аутентификации при загрузке страницы
		const checkTokensOnMount = async () => {
			// Если уже идет перенаправление, ничего не делаем
			if (redirectInProgress.current) return;

			const tokens = await KeycloakService.getTokens();
			console.log('Токены при загрузке экрана логина:', {
				hasAccessToken: !!tokens.accessToken,
				accessTokenValue:
					typeof tokens.accessToken === 'string'
						? tokens.accessToken.substring(0, 10) + '...'
						: null,
				hasRefreshToken: !!tokens.refreshToken,
				hasIdToken: !!tokens.idToken,
			});

			// Если токены есть, перенаправляем на главную страницу
			if (
				tokens.accessToken &&
				tokens.accessToken !== 'null' &&
				tokens.accessToken !== ''
			) {
				console.log(
					'Найден активный токен, перенаправление на главную',
				);
				redirectInProgress.current = true;
				await checkAuth(); // Обновляем состояние авторизации перед переходом
				router.replace('/(app)');
			}
		};

		checkTokensOnMount();
	}, [checkAuth]);

	// Обработка ответа после авторизации
	useEffect(() => {
		async function handleAuthResponse() {
			if (!response || redirectInProgress.current) return;

			console.log('Ответ авторизации:', {
				type: response.type,
				hasCodeVerifier: !!request?.codeVerifier,
				hasDiscovery: !!discovery,
			});
			if (response?.type === 'success' && request?.codeVerifier) {
				setIsLoading(true);
				setAuthError(null);
				try {
					const { code } = response.params;
					console.log(
						'Получен код авторизации, выполняем обмен на токены',
					);
					const tokens = await exchangeCodeForTokens(
						code,
						request.codeVerifier,
						discovery,
					);

					console.log('Успешная авторизация, сохраняем токены');
					const saveResult = await KeycloakService.saveTokens(tokens);
					console.log('Результат сохранения токенов:', saveResult);

					const savedTokens = await KeycloakService.getTokens();
					console.log('Токены после сохранения:', {
						hasAccessToken: !!savedTokens.accessToken,
						tokenLength: savedTokens.accessToken
							? savedTokens.accessToken.length
							: 0,
					});

					if (savedTokens.accessToken) {
						console.log('Токен получен и сохранен успешно');
						redirectInProgress.current = true;
						setTimeout(() => {
							router.replace('/(app)');
						}, 300);
					} else {
						console.error('Токен не был сохранен корректно');
						setAuthError('Ошибка при сохранении токена');
					}
				} catch (error) {
					console.error('Ошибка обмена кода на токены:', error);
					setAuthError('Ошибка при получении токенов');
				} finally {
					setIsLoading(false);
				}
			} else if (response.type === 'error') {
				console.error('Ошибка авторизации:', response.error);
				setAuthError(
					`Ошибка авторизации: ${response.error || 'неизвестная ошибка'}`,
				);
			} else if (response.type !== 'success') {
				console.error(
					'Некорректный тип ответа авторизации:',
					response.type,
				);
				setAuthError('Авторизация не выполнена');
			} else if (!request?.codeVerifier) {
				console.error(
					'Отсутствует codeVerifier для обмена кода на токены',
				);
				setAuthError(
					'Ошибка безопасности: отсутствует проверочный код',
				);
			}
		}

		if (response) {
			handleAuthResponse();
		}
	}, [response, discovery, request, checkAuth]);

	const handleLogin = async () => {
		setAuthError(null);
		console.log('KEYCLOAK_CONFIG:', KEYCLOAK_CONFIG);

		try {
			// Очищаем существующие токены перед новой авторизацией
			await KeycloakService.logout();

			setTimeout(() => {
				promptAsync().catch(error => {
					console.error('Ошибка при запуске авторизации:', error);
					setAuthError('Не удалось запустить процесс авторизации');
				});
			}, 100);
		} catch (error) {
			console.error('Ошибка при подготовке к авторизации:', error);
		}
	};

	return (
		<View style={styles.container}>
			{authError && <Text style={styles.errorText}>{authError}</Text>}
			<AppButton
				text={isLoading ? 'Загрузка...' : 'Войти'}
				disabled={!isReady || isLoading || redirectInProgress.current}
				onPress={handleLogin}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
	},
	errorText: {
		color: Colors.red,
		marginBottom: 16,
		textAlign: 'center',
	},
});
