import { Colors } from '@/shared/tokens';
import { AppText } from '@/shared/ui';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const TripDetailsPage: React.FC = () => {
	const { id } = useLocalSearchParams();

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<AppText style={styles.title}>Детали поездки</AppText>
				<AppText>ID поездки: {id}</AppText>
				<AppText>Здесь будут отображаться детали поездки</AppText>
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
