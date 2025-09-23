import { StyleSheet, TouchableOpacityProps, View } from 'react-native';

import { Colors, Gaps, Radius } from '@/shared/tokens';

import { IconButton } from '../Button';

type ActionButtonVariant = 'horizontal' | 'vertical';
interface ActionButtonProps extends Omit<TouchableOpacityProps, 'onPress'> {
	onPress: () => void;
	variant?: ActionButtonVariant;
	ref?: React.Ref<View>;
}

export const ActionButton = ({
	onPress,
	style,
	variant = 'horizontal',
	ref,
	...props
}: ActionButtonProps) => {
	const isHorizontalVariant = variant === 'vertical';
	return (
		<View ref={ref} collapsable={false}>
			<IconButton
				style={[
					styles.container,
					isHorizontalVariant ? styles.column : styles.row,
					style,
				]}
				onPress={onPress}
				feedback='opacity'
				hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				{...props}
			>
				<View style={styles.circle} />
				<View style={styles.circle} />
				<View style={styles.circle} />
			</IconButton>
		</View>
	);
};

const styles = StyleSheet.create({
	circle: {
		backgroundColor: Colors.lightInputText,
		borderRadius: Radius.r8 / 2,
		height: 4,
		width: 4,
	},
	column: {
		flexDirection: 'column',
	},
	container: {
		gap: Gaps.g3,
		padding: 1,
	},
	row: {
		flexDirection: 'row',
	},
});
