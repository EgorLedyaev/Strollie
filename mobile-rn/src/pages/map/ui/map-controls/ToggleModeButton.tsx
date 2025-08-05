import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';

export const ToggleModeButton = ({
	is3D,
	onPress,
	disabled,
}: {
	is3D: boolean;
	onPress: () => void;
	disabled: boolean;
}) => (
	<IconButton
		style={[styles.button, disabled && styles.disabled]}
		onPress={onPress}
		disabled={disabled}
	>
		<AppText style={styles.text} allowFontScaling={false}>
			{is3D ? '2D' : '3D'}
		</AppText>
	</IconButton>
);

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		boxShadow: Shadows.boxShadow,
		width: 46,
		height: 46,
	},
	disabled: {
		backgroundColor: Colors.gray,
	},
	text: {
		fontFamily: Fonts.medium,
		fontSize: Fonts.f20,
		color: Colors.grayIcon,
	},
});
