import PlusIcon from '@/assets/icons/action/PlusIcon';
import { StyleSheet, TouchableOpacityProps } from 'react-native';

import { Colors, Radius, Sizes } from '@/shared/tokens';

import { IconButton } from '../Button';

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
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r8,
		height: Sizes.button.sm,
		justifyContent: 'center',
		width: Sizes.button.sm,
	},
});
