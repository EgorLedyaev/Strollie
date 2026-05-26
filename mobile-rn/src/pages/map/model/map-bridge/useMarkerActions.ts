import { useCallback } from 'react';
import { Alert } from 'react-native';

import type { PlacedMarkerData } from '../marker-store';

interface MarkerActionsParams {
	sendMessageToWebView: (message: Record<string, unknown>) => void;
	setPlacedMarkers: (
		updater: (prev: PlacedMarkerData[]) => PlacedMarkerData[],
	) => void;
}

export function useMarkerActions({
	sendMessageToWebView,
	setPlacedMarkers,
}: MarkerActionsParams) {
	const handleDeleteMarker = useCallback(
		(idToDelete: string | null) => {
			if (!idToDelete) return;
			sendMessageToWebView({
				type: 'removeMarker',
				payload: { markerId: idToDelete },
			});
			setPlacedMarkers(prev => prev.filter(m => m.id !== idToDelete));
		},
		[sendMessageToWebView, setPlacedMarkers],
	);

	const showMarkerActionMenu = useCallback(
		(markerId: string) => {
			Alert.alert(
				`Метка ${markerId.substring(0, 6)}...`,
				'Выберите действие',
				[
					{
						text: 'Удалить',
						onPress: () => handleDeleteMarker(markerId),
						style: 'destructive',
					},
					{ text: 'Отмена', style: 'cancel' },
				],
				{ cancelable: true },
			);
		},
		[handleDeleteMarker],
	);

	const clearAllMarkers = useCallback(() => {
		setPlacedMarkers(prev => {
			prev.forEach(marker => {
				sendMessageToWebView({
					type: 'removeMarker',
					payload: { markerId: marker.id },
				});
			});
			return [];
		});
	}, [setPlacedMarkers, sendMessageToWebView]);

	return {
		handleDeleteMarker,
		showMarkerActionMenu,
		clearAllMarkers,
	};
}
