import AvatarIcon from '@/assets/icons/avatar';
import { Colors } from '@/shared/tokens';
import { Link, LinkProps } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export const ProfileButton = (props: LinkProps) => {
	return (
		<>
			<Link {...props}>
				<View style={styles.iconContainer}>
					<AvatarIcon />
				</View>
			</Link>
		</>
	);
};
const styles = StyleSheet.create({
	iconContainer: {
		width: 50,
		height: 50,
		borderRadius: 20,
		backgroundColor: Colors.white,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
