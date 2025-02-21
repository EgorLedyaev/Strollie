import map from '@/assets/images/map.png';
import navbar from '@/assets/images/nav-bar.png';
import { ProfileButton } from '@/features/layout/ui/ProfileButton/ProfileButton';
import { Input } from '@/shared/Input/Input';
import { Colors } from '@/shared/tokens';
import {
	Dimensions,
	Image,
	ImageBackground,
	StyleSheet,
	View,
} from 'react-native';

const { width } = Dimensions.get('window');
export default function MapPage() {
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
	footer: {
		width: '100%',
		bottom: -255,
	},
	navBar: {
		width: width,
		height: '100%',
		resizeMode: 'contain',
	},
});
