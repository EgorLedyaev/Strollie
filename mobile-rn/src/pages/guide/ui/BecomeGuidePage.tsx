import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

export function BecomeGuidePage() {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<AppText variant='h2'>Стать гидом Strollie</AppText>
				<AppText>
					Здесь будет форма заявки или информация для будущих гидов.
				</AppText>
			</View>
		</SafeAreaView>
	);
}

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
		alignItems: 'center',
		justifyContent: 'center',
	},
});
