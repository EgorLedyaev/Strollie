import { Colors } from '@/src/shared/tokens';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Provider as JotaiProvider } from 'jotai';

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
	useEffect(() => {
		setTimeout(() => {
			SplashScreen.hideAsync();
		}, 3000); // 3 секунды задержки
	}, []);
	const insets = useSafeAreaInsets();

	const [fontsLoaded, fontError] = useFonts({
		'SuisseIntl-Regular': require('../assets/fonts/SuisseIntl-Regular.otf'),
		'SuisseIntl-SemiBold': require('../assets/fonts/SuisseIntl-SemiBold.otf'),
		'SuisseIntl-Bold': require('../assets/fonts/SuisseIntl-Bold.otf'),
		'SuisseIntl-Medium': require('../assets/fonts/SuisseIntl-Medium.otf'),
	});

	return (
		<JotaiProvider>
			<SafeAreaProvider>
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
						options={{ title: 'Verify Code', headerShown: false }}
					/>
					<Stack.Screen
						name='user-data'
						options={{ title: 'User Data', headerShown: false }}
					/>
				</Stack>
			</SafeAreaProvider>
		</JotaiProvider>
	);
}
