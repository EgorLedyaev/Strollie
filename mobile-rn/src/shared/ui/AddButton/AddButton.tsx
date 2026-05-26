import PlusIcon from '@/assets/icons/action/PlusIcon';
import { StyleSheet, TouchableOpacityProps } from 'react-native';

import { Colors, Radius, Sizes } from '@/shared/tokens';

import { ActionTouchable } from '../Button';

export const AddButton = ({ style, ...props }: TouchableOpacityProps) => {
	return (
		<ActionTouchable
			style={[styles.container, style]}
			feedback='overlay'
			{...props}
		>
			<PlusIcon />
		</ActionTouchable>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r8,
		height: Sizes.button.sm,
		justifyContent: 'center',
		width: Sizes.button.sm,
	},
});
