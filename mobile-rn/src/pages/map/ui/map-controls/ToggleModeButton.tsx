import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';



import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';





export const ToggleModeButton = ({
	is3D,
	onPress,
	disabled,
}: {
	is3D: boolean;
	onPress: () => void;
	disabled: boolean;
}) => (
	<TouchableOpacity
		style={[styles.button, disabled && styles.disabled]}
		onPress={onPress}
		disabled={disabled}
	>
		<AppText style={styles.text} allowFontScaling={false}>
			{is3D ? '2D' : '3D'}
		</AppText>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		elevation: 4,
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 8,
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