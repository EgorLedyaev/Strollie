import ArrowLeftLargeIcon from '@/assets/icons/arrow/ArrowLeftLargeIcon';
import ArrowLeftSmallIcon from '@/assets/icons/arrow/ArrowLeftSmallIcon';
import { StyleSheet, TouchableOpacityProps } from 'react-native';

import { Colors, Gaps, Radius, Sizes } from '@/shared/tokens';

import { IconButton } from '../Button';
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
		<IconButton
			style={[
				style,
				isTextVariant ? styles.textContainer : styles.iconContainer,
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
		</IconButton>
	);
};

const styles = StyleSheet.create({
	textContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	iconContainer: {
		width: Sizes.button.sm,
		height: Sizes.button.sm,
		backgroundColor: Colors.white,
		borderRadius: Radius.r8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	// Стили для текстового варианта
	largeIcon: {
		marginRight: Gaps.g5,
	},
	text: {
		color: Colors.greenLink,
	},
});
