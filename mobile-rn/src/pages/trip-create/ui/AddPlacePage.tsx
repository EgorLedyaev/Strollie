import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

export function AddPlacePage() {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<AppText style={styles.title}>Добавить место</AppText>
				<AppText>Здесь будет возможность добавления места</AppText>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.lightBackground,
		flex: 1,
		padding: 16,
	},
	content: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r20,
		flex: 1,
		padding: 16,
	},
	title: {
		color: Colors.black,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
		marginBottom: 16,
	},
});
