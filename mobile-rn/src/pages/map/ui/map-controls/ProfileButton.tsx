import AvatarIcon from '@/assets/icons/avatar';
import { Link, LinkProps } from 'expo-router';
import { StyleSheet, View, ViewProps } from 'react-native';

import { Colors } from '@/shared/tokens';

type ProfileButtonProps = LinkProps & {
	pointerEvents?: ViewProps['pointerEvents'];
};

export const ProfileButton = ({
	pointerEvents,
	...linkProps
}: ProfileButtonProps) => {
	return (
		<>
			<Link {...linkProps}>
				<View
					style={styles.iconContainer}
					pointerEvents={pointerEvents}
				>
					<AvatarIcon />
				</View>
			</Link>
		</>
	);
};
const styles = StyleSheet.create({
	iconContainer: {
		width: 50,
		aspectRatio: 1,
		height: 50,
		borderRadius: 20,
		backgroundColor: Colors.white,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
