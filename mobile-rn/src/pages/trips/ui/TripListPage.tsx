import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/src/shared/tokens';
import { AppText } from '@/src/shared/ui';

export const TripListPage: React.FC = () => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<AppText style={styles.title}>Мои поездки</AppText>
				<AppText>
					Здесь будет отображаться список поездок пользователя
				</AppText>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightBackground,
		padding: 16,
	},
	content: {
		backgroundColor: Colors.white,
		borderRadius: 20,
		padding: 16,
		flex: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 16,
		color: Colors.black,
	},
});
