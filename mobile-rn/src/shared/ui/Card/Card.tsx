import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors, Shadows } from '../../tokens';

interface CardProps {
	children: React.ReactNode;
	style?: object;
}

export const Card = ({ children, style }: CardProps) => {
	return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: Colors.white,
		borderRadius: 16,
		padding: 16,
		...Shadows.shadow1
	},
});
