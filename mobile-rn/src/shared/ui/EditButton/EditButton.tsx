import EditPhotoIcon from '@/assets/icons/EditPhotoIcon';
import React, { ComponentPropsWithoutRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors, Radius } from '@/shared/tokens';

import { ActionTouchable } from '../Button';

type EditButtonProps = Omit<
	ComponentPropsWithoutRef<typeof ActionTouchable>,
	'children'
> & {
	size?: number;
	borderRadius?: number;
	backgroundColor?: string;
	iconColor?: string;
};

export const EditButton: React.FC<EditButtonProps> = ({
	onPress,
	size = 34,
	borderRadius = Radius.r12,
	backgroundColor = Colors.grayBackground,
	iconColor = Colors.textAAA,
	style,
	...props
}) => {
	return (
		<ActionTouchable onPress={onPress} style={style} {...props}>
			<View
				style={[
					styles.square,
					{
						height: size,
						width: size,
						borderRadius,
						backgroundColor,
					},
				]}
			>
				<EditPhotoIcon color={iconColor} />
			</View>
		</ActionTouchable>
	);
};

const styles = StyleSheet.create({
	square: {
		alignItems: 'center',
		justifyContent: 'center',
	},
});
