import { Redirect, router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useAuthCheck } from '@/src/features/auth-by-email';
import { Colors } from '@/src/shared/tokens';
import { AppText } from '@/src/shared/ui';

export default function AppLayout() {
	const { isAuthenticated, isLoading, checkAuth } = useAuthCheck();
	const insets = useSafeAreaInsets();
	const redirectInProgress = useRef(false);

	// Проверка авторизации
	useEffect(() => {
		const checkUserAuth = async () => {
			if (isLoading || redirectInProgress.current) return;
			if (!isAuthenticated) {
				console.log(
					'AppLayout: Пользователь не авторизован, перенаправление на /sign-in',
				);
				redirectInProgress.current = true;
				router.replace('/sign-in');
			} else {
				console.log(
					'AppLayout: Пользователь авторизован, доступ разрешен',
				);
			}
		};
		checkUserAuth();
	}, [isAuthenticated, isLoading, checkAuth]);

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<AppText>Загрузка...</AppText>
			</View>
		);
	}
	return (
		<>
			<StatusBar style='dark' translucent={true} />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: {
						backgroundColor: Colors.lightBackground,
						// paddingTop: insets.top,
					},
				}}
			>
				<Stack.Screen name='index' />
				<Stack.Screen name='profile' />
			</Stack>
		</>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
