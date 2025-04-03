import FiraSans from '@/assets/fonts/FiraSans-Regular.ttf';
import FiraSansSemiBold from '@/assets/fonts/FiraSans-SemiBold.ttf';
import { KeycloakService } from '@/entities/auth/api/keycloak.service';
import { useAuth } from '@/entities/auth/model/auth-context';
import { Colors } from '@/shared/tokens';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function AppLayout() {
	const { isAuthenticated, isLoading, checkAuth } = useAuth();
	const insets = useSafeAreaInsets();
	const redirectInProgress = useRef(false);

	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				// Если пользователь авторизован, предотвращаем выход на экран логина
				return isAuthenticated;
			},
		);

		return () => backHandler.remove();
	}, [isAuthenticated]);

	// Проверка авторизации
	useEffect(() => {
		const checkUserAuth = async () => {
			if (isLoading || redirectInProgress.current) return;

			const tokens = await KeycloakService.getTokens();
			const hasValidToken =
				tokens.accessToken &&
				tokens.accessToken !== 'null' &&
				tokens.accessToken !== '';

			if (!isAuthenticated && hasValidToken) {
				// Если есть токен, но isAuthenticated = false, обновим AuthState
				await checkAuth();
				return;
			}

			if (!isAuthenticated || !hasValidToken) {
				console.log(
					'AppLayout: Пользователь не авторизован, перенаправление на /login',
				);
				redirectInProgress.current = true;
				router.replace('/login');
			} else {
				console.log(
					'AppLayout: Пользователь авторизован, доступ разрешен',
				);
			}
		};
		checkUserAuth();
	}, [isAuthenticated, isLoading, checkAuth]);
	useFonts({
		FiraSans: FiraSans,
		FiraSansSemiBold: FiraSansSemiBold,
	});

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<Text>Загрузка...</Text>
			</View>
		);
	}
	return (
		<SafeAreaProvider>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: {
						backgroundColor: Colors.white,
						paddingTop: insets.top,
					},
				}}
			>
				<Stack.Screen name='index' />
				<Stack.Screen name='profile' />
			</Stack>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
