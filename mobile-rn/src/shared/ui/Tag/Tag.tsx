import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors, Fonts, Radius } from '../../tokens';
import { AppText } from '../Text';

interface TagProps {
	label: string;
	color?: string;
	style?: object;
	textStyle?: object;
}

export const Tag = ({
	label,
	color = Colors.black,
	style,
	textStyle,
}: TagProps) => {
	return (
		<View style={[styles.tag, { borderColor: color }, style]}>
			<AppText style={[styles.text, { color }, textStyle]}>
				{label.startsWith('#') ? label : `#${label}`}
			</AppText>
		</View>
	);
};

const styles = StyleSheet.create({
	tag: {
		alignSelf: 'flex-start',
		borderRadius: Radius.r10, // ближайший токен к 12 (нет r12)
		borderWidth: 1,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	text: {
		fontFamily: Fonts.medium,
		fontSize: Fonts.f12,
	},
});
