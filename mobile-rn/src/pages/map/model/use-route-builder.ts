import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { Alert } from 'react-native';

import { mapReadyAtom } from '@/src/entities/map';
import { placedMarkersAtom } from '@/src/entities/marker';
import { useLocationTracking } from '@/src/shared/lib';

type SendMessageToWebView = (message: unknown) => void;

export const useRouteBuilder = (sendMessageToWebView: SendMessageToWebView) => {
	const [mapReady] = useAtom(mapReadyAtom);
	const { location } = useLocationTracking(mapReady);
	const [placedMarkers] = useAtom(placedMarkersAtom);

	const handleBuildRouteThroughPlaced = useCallback(async () => {
		if (!mapReady || !location || placedMarkers.length === 0) {
			Alert.alert(
				'Недостаточно данных',
				'Для построения маршрута требуется ваше местоположение и хотя бы одна точка на карте.',
			);
			return;
		}

		sendMessageToWebView({ type: 'clearRoute' });
		sendMessageToWebView({ type: 'routeBuildStarted' });
	}, [mapReady, location, placedMarkers, sendMessageToWebView]);

	return { handleBuildRouteThroughPlaced };
};
