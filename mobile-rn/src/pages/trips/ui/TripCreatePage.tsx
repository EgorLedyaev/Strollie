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
	container: {
		flex: 1,
		backgroundColor: Colors.lightBackground,
		padding: 16,
	},
	content: { flex: 1 },
	title: {
		fontSize: Fonts.f20,
		fontFamily: Fonts.bold,
		marginBottom: 16,
		color: Colors.headerAndInputText,
	},
	actions: { flexDirection: 'row', gap: 12 },
	action: { height: 44, flex: 1 },
});
