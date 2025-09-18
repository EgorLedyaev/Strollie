import { Colors } from '@/shared/tokens';
import { AppText } from '@/shared/ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SavedRoutesPage: React.FC = () => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<AppText style={styles.title}>Сохраненные маршруты</AppText>
				<AppText>
					Здесь будет отображаться список сохраненных маршрутов
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
