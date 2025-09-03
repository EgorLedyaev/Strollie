import { StyleSheet, TouchableOpacityProps } from 'react-native';

import { Colors, Radius, Sizes } from '@/shared/tokens';

import { IconButton } from '../Button';
import PlusIcon from '@/assets/icons/action/PlusIcon';

interface PlusButtonProps extends Omit<TouchableOpacityProps, 'onPress'> {
	onPress: () => void;
}

export const PlusButton = ({ onPress, style, ...props }: PlusButtonProps) => {
	return (
		<IconButton
			style={[style, styles.iconContainer]}
			onPress={onPress}
			feedback='overlay'
			{...props}
		>
			<PlusIcon />
		</IconButton>
	);
};

const styles = StyleSheet.create({
	iconContainer: {
		width: Sizes.button.sm,
		height: Sizes.button.sm,
		backgroundColor: Colors.white,
		borderRadius: Radius.r8,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
