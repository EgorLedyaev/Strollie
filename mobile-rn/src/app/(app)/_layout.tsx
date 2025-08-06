import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BottomNavBar } from '@/widgets/bottom-nav-bar';
import { Colors } from '@/shared/tokens';

export default function AuthLayout() {
	const pathname = usePathname();

	// Список маршрутов, на которых ДОЛЖЕН отображаться BottomNavBar
	// Заметь, что для главной страницы (index) expo-router возвращает просто "/"
	const navBarVisibleRoutes = ['/', '/profile'];

	const isNavBarVisible = navBarVisibleRoutes.includes(pathname);

	return (
		<SafeAreaProvider>
			<StatusBar style='dark'/>
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
					<Stack.Screen name='guide/index' />
					<Stack.Screen name='profile/index' />
					<Stack.Screen name='profile/edit' />
					<Stack.Screen name='calendar/index' />
					<Stack.Screen name='trips/index' />
					<Stack.Screen name='trips/[id]' />
					<Stack.Screen name='tickets/index' />
					<Stack.Screen name='routes/history' />
					<Stack.Screen name='routes/saved' />
				</Stack>
				<BottomNavBar isVisible={isNavBarVisible} />
			</View>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
