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

import { ReactQueryProvider } from '@/app/providers/_with-react-query';
import { SessionProvider } from '@/app/providers/with-session';
import {
	ANALYTICS_DEBUG,
	ANALYTICS_ENABLED,
	ANALYTICS_INCLUDE_CONTEXT,
	APPMETRICA_API_KEY,
} from '@/shared/config';
import { analytics, createAppMetricaTransport } from '@/shared/lib';
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
							<ReactQueryProvider>
								<Root />
							</ReactQueryProvider>
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
		analytics.registerTransport(
			createAppMetricaTransport({
				apiKey: APPMETRICA_API_KEY,
				logs: ANALYTICS_DEBUG,
				includeContext: ANALYTICS_INCLUDE_CONTEXT,
			}),
		);

		analytics
			.init({
				appVersion: ExpoConstants.default?.expoConfig?.version,
				platform: Platform.OS,
				enabled: ANALYTICS_ENABLED,
				debug: ANALYTICS_DEBUG,
			})
			.then(() =>
				analytics.trackEvent('app.launch', {
					source: 'cold',
					trigger: 'root-layout',
				}),
			)
			.catch(error =>
				console.warn(
					'[analytics] Не удалось инициализировать сервис',
					error,
				),
			);
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
