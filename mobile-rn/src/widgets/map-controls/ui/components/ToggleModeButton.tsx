import { Colors, Fonts } from '@/src/shared/tokens';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

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
		<Text style={styles.text}>{is3D ? '2D' : '3D'}</Text>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	button: {
		backgroundColor: Colors.white,
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 8,
		elevation: 3,
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
	},
	disabled: {
		backgroundColor: Colors.gray,
	},
	text: {
		fontFamily: Fonts.semibold,
		fontSize: 16,
		color: Colors.black,
	},
});
