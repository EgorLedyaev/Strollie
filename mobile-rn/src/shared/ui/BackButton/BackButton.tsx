import ArrowLeftLargeIcon from '@/assets/icons/arrow/ArrowLeftLargeIcon';
import ArrowLeftSmallIcon from '@/assets/icons/arrow/ArrowLeftSmallIcon';
import { StyleSheet, TouchableOpacityProps } from 'react-native';

import { Colors, Gaps, Radius, Sizes } from '@/shared/tokens';

import { ActionTouchable } from '../Button';
import { AppText } from '../Text';

type BackButtonVariant = 'icon' | 'text';
interface BackButtonProps extends Omit<TouchableOpacityProps, 'onPress'> {
	text?: string;
	onPress: () => void;
	variant?: BackButtonVariant;
}

export const BackButton = ({
	text = 'Вернуться',
	onPress,
	style,
	variant = 'text',
	...props
}: BackButtonProps) => {
	const isTextVariant = variant === 'text';
	return (
		<ActionTouchable
			style={[
				isTextVariant ? styles.textContainer : styles.iconContainer,
				style,
			]}
			onPress={onPress}
			feedback={isTextVariant ? 'opacity' : 'overlay'}
			{...props}
		>
			{isTextVariant ? (
				<>
					<ArrowLeftLargeIcon
						style={styles.largeIcon}
						stroke={Colors.greenLink}
					/>
					<AppText style={styles.text}>{text}</AppText>
				</>
			) : (
				<ArrowLeftSmallIcon />
			)}
		</ActionTouchable>
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
	largeIcon: {
		marginRight: Gaps.g5,
	},
	text: {
		color: Colors.greenLink,
	},
	textContainer: {
		alignItems: 'center',
		flexDirection: 'row',
	},
});
