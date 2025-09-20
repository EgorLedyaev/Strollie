import * as ExpoConstants from 'expo-constants';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { Provider as JotaiProvider } from 'jotai';
import { Suspense, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SessionProvider } from '@/app/providers/with-session';
import { initLogger } from '@/shared/lib/logger';
import { Colors } from '@/shared/tokens';

// Предотвращаем автоскрытие сплеш-экрана
SplashScreen.preventAutoHideAsync();

// Экспортируем функцию по умолчанию
export default function RootLayout() {
	return (
		<GestureHandlerRootView style={style.container}>
			<JotaiProvider>
				<KeyboardProvider>
					<SafeAreaProvider>
						<Suspense fallback={null}>
							<SystemBars style='dark' />
							<Root />
						</Suspense>
					</SafeAreaProvider>
				</KeyboardProvider>
			</JotaiProvider>
		</GestureHandlerRootView>
	);
}

function Root() {
	const [fontsLoaded, fontError] = useFonts({
		'SuisseIntl-Regular': require('@/assets/fonts/SuisseIntl-Regular.otf'),
		'SuisseIntl-SemiBold': require('@/assets/fonts/SuisseIntl-SemiBold.otf'),
		'SuisseIntl-Bold': require('@/assets/fonts/SuisseIntl-Bold.otf'),
		'SuisseIntl-Medium': require('@/assets/fonts/SuisseIntl-Medium.otf'),
	});

	useEffect(() => {
		initLogger({
			level: __DEV__ ? 'debug' : 'info',
			defaultContext: {
				platform: Platform.OS,
				appVersion:
					ExpoConstants.default?.expoConfig?.version || 'unknown',
			},
		});
	}, []);

	useEffect(() => {
		if (fontsLoaded || fontError) {
			console.log(
				'Гидратация и загрузка шрифтов завершены. Скрываем сплэш-экран.',
			);
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	// Если шрифты не загрузились, возвращаем пустой контейнер,
	// чтобы приложение не пыталось рендерить до загрузки шрифтов
	if (!fontsLoaded && !fontError) {
		return <View />; // Пустой контейнер вместо null
	}

	// После загрузки шрифтов рендерим основной интерфейс
	return (
		<SessionProvider>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: {
						backgroundColor: Colors.lightBackground,
					},
				}}
			>
				<Stack.Screen
					name='index'
					options={{ title: 'Splash', headerShown: false }}
				/>
				<Stack.Screen
					name='sign-in'
					options={{ title: 'Sign In', headerShown: false }}
				/>
				<Stack.Screen
					name='register'
					options={{ title: 'Register', headerShown: false }}
				/>
				<Stack.Screen
					name='verify-code'
					options={{
						title: 'Verify Code',
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name='user-data'
					options={{ title: 'User Data', headerShown: false }}
				/>
			</Stack>
		</SessionProvider>
	);
}

const style = StyleSheet.create({
	container: {
		flex: 1,
	},
});
