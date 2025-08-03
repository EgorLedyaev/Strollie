import CloseIcon from '@/assets/icons/close';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Pressable, StyleSheet, View } from 'react-native';

interface CloseDrawerProps {
	navigation: DrawerContentComponentProps['navigation'];
}

export const CloseDrawer = ({ navigation }: CloseDrawerProps) => {
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
