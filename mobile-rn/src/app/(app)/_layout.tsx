import { Colors } from '@/shared/tokens';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AuthLayout() {
	return (
		<SafeAreaProvider>
			<StatusBar style='dark' />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: {
						backgroundColor: Colors.lightBackground,
					},
				}}
			>
				<Stack.Screen name='index' />
				<Stack.Screen name='profile/index' />
				<Stack.Screen name='profile/edit' />
				<Stack.Screen name='calendar/index' />
				<Stack.Screen name='trips/index' />
				<Stack.Screen name='trips/[id]' />
				<Stack.Screen name='tickets/index' />
				<Stack.Screen name='routes/history' />
				<Stack.Screen name='routes/saved' />
			</Stack>
		</SafeAreaProvider>
	);
}
