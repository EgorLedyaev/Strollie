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
	loader: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Colors.backgroundMapStatus,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 10,
	},
	loaderText: {
		marginTop: 10,
		fontSize: 16,
		color: Colors.black,
	},
	errorText: {
		color: Colors.red,
		marginTop: 5,
		textAlign: 'center',
		fontSize: 12,
		paddingHorizontal: 20,
	},
});
