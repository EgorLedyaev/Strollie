import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as JotaiProvider } from 'jotai';
import { useEffect } from 'react';
import { View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { SessionStorage } from '@/src/entities/session';
import { Colors } from '@/src/shared/tokens';

// Предотвращаем автоскрытие сплеш-экрана
SplashScreen.preventAutoHideAsync();

// Экспортируем функцию по умолчанию
export default function RootLayout() {
	useEffect(() => {
		// Инициализируем SessionStorage при загрузке приложения
		const initSession = async () => {
			try {
				// Загружаем список зарегистрированных пользователей
				const users = await SessionStorage.getRegisteredUsers();
				console.log(
					'Инициализация приложения. Зарегистрированные пользователи:',
					users,
				);
			} catch (error) {
				console.error('Ошибка инициализации сессии:', error);
			}

			// Показываем сплеш
			setTimeout(() => {
				SplashScreen.hideAsync();
			}, 3000); // 3 секунды задержки
		};

		initSession();
	}, []);

	const [fontsLoaded, fontError] = useFonts({
		'SuisseIntl-Regular': require('../assets/fonts/SuisseIntl-Regular.otf'),
		'SuisseIntl-SemiBold': require('../assets/fonts/SuisseIntl-SemiBold.otf'),
		'SuisseIntl-Bold': require('../assets/fonts/SuisseIntl-Bold.otf'),
		'SuisseIntl-Medium': require('../assets/fonts/SuisseIntl-Medium.otf'),
	});

	// Если шрифты не загрузились, возвращаем пустой контейнер,
	// чтобы приложение не пыталось рендерить до загрузки шрифтов
	if (!fontsLoaded && !fontError) {
		return <View />; // Пустой контейнер вместо null
	}

	// После загрузки шрифтов рендерим основной интерфейс
	return (
		<JotaiProvider>
			<KeyboardProvider>
				<SafeAreaProvider>
					<StatusBar style='dark' translucent={true} />
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
				</SafeAreaProvider>
			</KeyboardProvider>
		</JotaiProvider>
	);
}
