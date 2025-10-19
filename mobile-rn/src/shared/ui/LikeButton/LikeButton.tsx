import LikeIcon from '@/assets/icons/LikeIcon';
import React, { ComponentPropsWithoutRef, ComponentType } from 'react';
import { StyleSheet } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import { Colors, Radius } from '@/shared/tokens';

import { IconButton } from '../Button';

type LikeButtonProps = Omit<
	ComponentPropsWithoutRef<typeof IconButton>,
	'children'
> & {
	liked: boolean;
	variant?: 'small' | 'large';
	size?: number;
	borderRadius?: number;
	backgroundColor?: string;
	activeColor?: string;
	inactiveColor?: string;
	icon?: ComponentType<SvgProps & { color?: string }>;
};

export const LikeButton: React.FC<LikeButtonProps> = ({
	onPress,
	liked,
	style,
	variant = 'small',
	size,
	borderRadius,
	backgroundColor = Colors.grayBackground,
	activeColor = Colors.likeActive,
	inactiveColor = Colors.likeInactive,
	icon: IconComponent,
	...props
}) => {
	const computedSize = size ?? (variant === 'large' ? 44 : 32);
	const computedBorderRadius =
		borderRadius ?? (variant === 'large' ? Radius.r16 : Radius.r12);

	const resolvedActiveColor = activeColor ?? Colors.likeActive;
	const resolvedInactiveColor = inactiveColor ?? Colors.likeInactive;

	return (
		<IconButton
			onPress={onPress}
			style={[
				styles.likeButton,
				{
					height: computedSize,
					width: computedSize,
					borderRadius: computedBorderRadius,
					backgroundColor,
				},
				style,
			]}
			{...props}
		>
			{() =>
				IconComponent ? (
					<IconComponent
						color={
							liked ? resolvedActiveColor : resolvedInactiveColor
						}
						width={computedSize}
						height={computedSize}
					/>
				) : (
					<LikeIcon
						color={
							liked ? resolvedActiveColor : resolvedInactiveColor
						}
						size={computedSize}
						variant={variant}
					/>
				)
			}
		</IconButton>
	);
};

const styles = StyleSheet.create({
	likeButton: {
		alignItems: 'center',
		justifyContent: 'center',
	},
});
