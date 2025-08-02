import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAtomValue } from 'jotai';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { sessionAtom } from '@/src/entities/session';
import { Colors } from '@/src/shared/tokens';

export default function AppLayout() {
	// Мы используем синхронный атом, чтобы избежать "моргания"
	const session = useAtomValue(sessionAtom);

	// Если пользователь не авторизован, перенаправляем его на экран входа.
	// Redirect позаботится о том, чтобы очистить историю навигации.
	if (!session.isAuthenticated) {
		console.log(
			'AppLayout: Пользователь не авторизован, перенаправление на /sign-in',
		);
		return <Redirect href='/sign-in' />;
	}
	return (
		<SafeAreaProvider>
			<StatusBar style='dark' />
			<View style={styles.container}>
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
			</View>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
