import { Colors } from '@/shared/tokens';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '../Text';

interface MapStatusIndicatorProps {
	mapReady: boolean;
	mapError: string | null;
}

export const MapStatusIndicator: React.FC<MapStatusIndicatorProps> = ({
	mapReady,
	mapError,
}) => {
	if (mapReady) {
		return null; // Если карта готова, ничего не показываем
	}

	return (
		<View style={styles.loader}>
			<ActivityIndicator size='large' color={Colors.greenPrimary} />
			<AppText style={styles.loaderText}>
				{mapError ? 'Ошибка карты' : 'Загрузка карты...'}
			</AppText>
			{mapError && <AppText style={styles.errorText}>{mapError}</AppText>}
		</View>
	);
};

const styles = StyleSheet.create({
	errorText: {
		color: Colors.red,
		fontSize: 12,
		marginTop: 5,
		paddingHorizontal: 20,
		textAlign: 'center',
	},
	loader: {
		...StyleSheet.absoluteFillObject,
		alignItems: 'center',
		backgroundColor: Colors.backgroundMapStatus,
		justifyContent: 'center',
		zIndex: 10,
	},
	loaderText: {
		color: Colors.black,
		fontSize: 16,
		marginTop: 10,
	},
});
