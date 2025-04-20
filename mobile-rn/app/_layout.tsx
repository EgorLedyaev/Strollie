import { AuthProvider } from '@/src/entities/auth/model/auth-context';
import { Colors } from '@/src/shared/tokens';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
	useEffect(() => {
		setTimeout(() => {
			SplashScreen.hideAsync();
		}, 3000); // 3 секунды задержки
	}, []);
	const insets = useSafeAreaInsets();

	return (
		<AuthProvider>
			<SafeAreaProvider>
				<StatusBar
					style='dark'
					translucent={true}
					backgroundColor='transparent'
				/>
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
						name='sign-in'
						options={{ title: 'Sign In', headerShown: false }}
					/>
				</Stack>
			</SafeAreaProvider>
		</AuthProvider>
	);
}
