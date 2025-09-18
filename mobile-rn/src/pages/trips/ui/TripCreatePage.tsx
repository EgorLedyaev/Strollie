import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/shared/tokens';
import { AppButton, AppText } from '@/shared/ui';

export const TripCreatePage: React.FC = () => {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<AppText style={styles.title}>Новая поездка</AppText>
				<View style={styles.actions}>
					<AppButton
						text='Отмена'
						variant='outline'
						onPress={() => router.back()}
						style={styles.action}
					/>
					<AppButton
						text='Сохранить'
						onPress={() => router.back()}
						style={styles.action}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	action: { flex: 1, height: 44 },
	actions: { flexDirection: 'row', gap: 12 },
	container: {
		backgroundColor: Colors.lightBackground,
		flex: 1,
		padding: 16,
	},
	content: { flex: 1 },
	title: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
		marginBottom: 16,
	},
});
