import CloseIcon from '@/assets/icons/close';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/src/types';
import { Pressable, StyleSheet, View } from 'react-native';

export const CloseDrawer = (navigation: DrawerNavigationHelpers) => {
	return (
		<>
			<Pressable onPress={() => navigation.closeDrawer()}>
				<View style={styles.button}>
					<CloseIcon />
				</View>
			</Pressable>
		</>
	);
};

const styles = StyleSheet.create({
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: 20,
		right: 20,
	},
});
