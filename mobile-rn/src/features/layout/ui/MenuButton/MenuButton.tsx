import MenuIcon from '@/assets/icons/menu';
import { Colors } from '@/src/shared/tokens';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, PressableProps, StyleSheet, View } from 'react-native';

export const MenuButton = ({
	navigation,
	...props
}: PressableProps & {
	navigation: DrawerNavigationProp<ParamListBase, string, undefined>;
}) => {
	const [clicked, setClicked] = useState<boolean>(false);
	return (
		<>
			<Pressable
				{...props}
				onPressIn={() => setClicked(true)}
				onPressOut={() => setClicked(false)}
				onPress={() => navigation.toggleDrawer()}
			>
				<View
					style={{
						...styles.button,
						backgroundColor: clicked
							? Colors.violetDark
							: Colors.blackLight,
					}}
				>
					<MenuIcon />
				</View>
			</Pressable>
		</>
	);
};

const styles = StyleSheet.create({
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
		flex: 1,
	},
});
