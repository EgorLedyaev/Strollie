import IconLogo from '@/assets/icons/logo';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';

export default function Splash() {
	const router = useRouter();
	useEffect(() => {
		// Автоматический переход на экран входа после таймаута
		const timer = setTimeout(() => {
			router.replace('/sign-in');
		}, 200); // 2 секунды на отображение заставки

		return () => clearTimeout(timer);
	}, [router]);

	return (
		<View style={styles.container}>
			<SystemBars style='light' />
			<LinearGradient
				colors={['#1BF57E', '#1CC4C4']}
				style={styles.gradient}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
			>
				<IconLogo style={styles.logo} />
			</LinearGradient>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	gradient: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
	logo: {
		height: 138,
		width: 120,
	},
});
