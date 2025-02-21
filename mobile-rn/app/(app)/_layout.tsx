import FiraSans from '@/assets/fonts/FiraSans-Regular.ttf';
import FiraSansSemiBold from '@/assets/fonts/FiraSans-SemiBold.ttf';
import { authAtom } from '@/entities/auth/model/auth.state';
import { Colors } from '@/shared/tokens';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import { useAtomValue } from 'jotai';
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function AppLayout() {
	const insets = useSafeAreaInsets();
	const [loaded, error] = useFonts({
		FiraSans: FiraSans,
		FiraSansSemiBold: FiraSansSemiBold,
	});
	const { accessToken } = useAtomValue(authAtom);
	if (!accessToken) {
		return <Redirect href='/login' />;
	}
	return (
		<SafeAreaProvider>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: {
						backgroundColor: Colors.white,
						paddingTop: insets.top,
					},
				}}
			>
				<Stack.Screen name='profile' />
			</Stack>
		</SafeAreaProvider>
	);
}
