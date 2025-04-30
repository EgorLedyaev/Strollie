// src/components/MapStatusIndicator.tsx (создайте этот файл)
import { Colors } from '@/src/shared/tokens';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

// Убедитесь, что путь верный

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
			<Text style={styles.loaderText}>
				{mapError ? 'Ошибка карты' : 'Загрузка карты...'}
			</Text>
			{mapError && <Text style={styles.errorText}>{mapError}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	loader: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(255,255,255,0.8)',
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
