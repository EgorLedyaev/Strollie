import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

export const CalendarPage: React.FC = () => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<AppText style={styles.title}>Календарь</AppText>
				<AppText>
					Здесь будет отображаться календарь пользователя
				</AppText>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.lightBackground,
		flex: 1,
		padding: 16,
	},
	content: {
		backgroundColor: Colors.white,
		borderRadius: 20,
		flex: 1,
		padding: 16,
	},
	title: {
		color: Colors.black,
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 16,
	},
});
