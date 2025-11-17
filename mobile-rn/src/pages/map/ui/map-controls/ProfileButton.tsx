import AvatarIcon from '@/assets/icons/AvatarIcon';
import { Link, LinkProps } from 'expo-router';
import { StyleSheet, ViewProps } from 'react-native';

import { Colors, Radius } from '@/shared/tokens';
import { ActionTouchable } from '@/shared/ui';

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
				<ActionTouchable
					style={styles.iconContainer}
					pointerEvents={pointerEvents}
				>
					<AvatarIcon />
				</ActionTouchable>
			</Link>
		</>
	);
};
const styles = StyleSheet.create({
	iconContainer: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r20,
		height: 45,
		justifyContent: 'center',
		width: 45,
	},
});
