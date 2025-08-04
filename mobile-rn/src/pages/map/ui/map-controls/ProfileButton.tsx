import AvatarIcon from '@/assets/icons/AvatarIcon';
import { Link, LinkProps } from 'expo-router';
import { StyleSheet, ViewProps } from 'react-native';

import { Colors, Radius } from '@/shared/tokens';
import { IconButton } from '@/shared/ui';

type ProfileButtonProps = LinkProps & {
	pointerEvents?: ViewProps['pointerEvents'];
};

export const ProfileButton = ({
	pointerEvents,
	...linkProps
}: ProfileButtonProps) => {
	return (
		<>
			<Link {...linkProps} asChild>
				<IconButton
					style={styles.iconContainer}
					pointerEvents={pointerEvents}
				>
					<AvatarIcon />
				</IconButton>
			</Link>
		</>
	);
};
const styles = StyleSheet.create({
	iconContainer: {
		width: 45,
		height: 45,
		borderRadius: Radius.r20,
		backgroundColor: Colors.white,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
