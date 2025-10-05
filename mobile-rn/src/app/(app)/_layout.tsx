import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack, usePathname } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BottomNavBar } from '@/widgets/bottom-nav-bar';
import { BottomNavBarContext } from '@/shared/lib';
import { Colors } from '@/shared/tokens';

export default function AuthLayout() {
	const pathname = usePathname();

	// Список маршрутов, на которых ДОЛЖЕН отображаться BottomNavBar
	// Заметь, что для главной страницы (index) expo-router возвращает просто "/"
	const navBarVisibleRoutes = ['/', '/profile'];

	const shouldShowNavBar = navBarVisibleRoutes.includes(pathname);

	// Состояние для динамического управления видимостью (например, из PlaceDetailsSheet)
	const [navBarForceHidden, setNavBarForceHidden] = useState(false);

	const isNavBarVisible = shouldShowNavBar && !navBarForceHidden;

	// Context value для управления навбаром
	const navBarContextValue = useMemo(
		() => ({
			setNavBarVisible: (visible: boolean) => {
				setNavBarForceHidden(!visible);
			},
		}),
		[],
	);

	return (
		<GestureHandlerRootView style={styles.container}>
			<SafeAreaProvider>
				<SystemBars style='dark' />
				<BottomSheetModalProvider>
					<BottomNavBarContext.Provider value={navBarContextValue}>
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
								<Stack.Screen name='trips/new' />
								<Stack.Screen name='trips/[id]' />
								<Stack.Screen name='tickets/index' />
								<Stack.Screen name='routes/history' />
								<Stack.Screen name='routes/saved' />
							</Stack>
							<BottomNavBar isVisible={isNavBarVisible} />
						</View>
					</BottomNavBarContext.Provider>
				</BottomSheetModalProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
