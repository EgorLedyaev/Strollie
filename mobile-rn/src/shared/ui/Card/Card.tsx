import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '../../tokens';

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
		shadowColor: Colors.black,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
});
