import map from '@/assets/images/map.png';
import navbar from '@/assets/images/nav-bar.png';
import { useAuth } from '@/entities/auth/model/auth-context';
import { ProfileButton } from '@/features/layout/ui/ProfileButton/ProfileButton';
import { AppButton } from '@/shared/Button/AppButton';
import { Input } from '@/shared/Input/Input';
import { Colors } from '@/shared/tokens';
import { router } from 'expo-router';
import {
	Dimensions,
	Image,
	ImageBackground,
	StyleSheet,
	Text,
	View,
} from 'react-native';

const { width } = Dimensions.get('window');
export default function MapPage() {
	const { userInfo, logout } = useAuth();

	const handleLogout = async () => {
		await logout();
		router.replace('/login');
	};
	return (
		<>
			<ImageBackground source={map} style={styles.background}>
				<View style={styles.container}>
					<View style={styles.content}>
						<ProfileButton href={'/profile'} />
						<View style={styles.searchPlace}>
							<Input
								style={styles.text}
								placeholder='search places and adresses'
							/>
						</View>
					</View>
					{/* Блок с информацией о пользователе */}
					{userInfo && (
						<>
							<View style={styles.userInfoContainer}>
								<Text style={styles.userInfoTitle}>
									Данные пользователя:
								</Text>
								<Text>
									Имя:{' '}
									{userInfo.name ||
										userInfo.preferred_username ||
										'Н/Д'}
								</Text>
								<Text>Email: {userInfo.email || 'Н/Д'}</Text>
								<Text>ID: {userInfo.sub}</Text>
							</View>
							<View style={styles.logoutButtonContainer}>
								<AppButton
									text='Выйти'
									onPress={handleLogout}
								/>
							</View>
						</>
					)}

					<View style={styles.footer}>
						<Image style={styles.navBar} source={navbar} />
					</View>
				</View>
			</ImageBackground>
		</>
	);
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		resizeMode: 'cover',
	},
	container: { flex: 1 },
	content: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		top: 10,
		gap: 10,
		paddingHorizontal: 20,
	},
	searchPlace: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 20,
		backgroundColor: Colors.white,
		height: 50,
		borderRadius: 50,
	},
	text: {
		color: Colors.black,
	},
	userInfoContainer: {
		margin: 20,
		padding: 15,
		backgroundColor: Colors.white,
		borderRadius: 10,
	},
	userInfoTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	footer: {
		position: 'absolute',
		width: '100%',
		bottom: 0,
	},
	navBar: {
		width: width,
		height: '100%',
		resizeMode: 'contain',
	},
	logoutButtonContainer: {
		marginHorizontal: 20,
		marginBottom: 20,
	},
});
