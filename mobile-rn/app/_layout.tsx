import FiraSans from '@/assets/fonts/FiraSans-Regular.ttf';
import FiraSansSemiBold from '@/assets/fonts/FiraSans-SemiBold.ttf';
import { Colors } from '@/shared/tokens';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
	const insets = useSafeAreaInsets();
	const [loaded, error] = useFonts({
		FiraSans: FiraSans,
		FiraSansSemiBold: FiraSansSemiBold,
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);
	if (!loaded && !error) {
		return null;
	}
	return (
		<SafeAreaProvider>
			<StatusBar backgroundColor='transparent' translucent={false} />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: {
						backgroundColor: Colors.white,
						paddingTop: insets.top,
					},
				}}
			>
				<Stack.Screen name='login' />
				<Stack.Screen
					name='restore'
					options={{ presentation: 'modal' }}
				/>
			</Stack>
		</SafeAreaProvider>
	);
}
