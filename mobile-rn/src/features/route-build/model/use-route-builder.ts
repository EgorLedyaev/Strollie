import {
	buildOptimalRoute,
	RouteResponse,
	ValhallaRouteRequest,
} from '@/src/shared/api';
import { useLocationTracking } from '@/src/shared/lib';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

import { mapReadyAtom } from '@/src/entities/map';
import { placedMarkersAtom } from '@/src/entities/marker';
import {
	actualRouteDistanceAtom,
	isBuildingRouteAtom,
	routePreferencesAtom,
} from '@/src/entities/route';

type SendMessageToWebView = (message: any) => void;

export const useRouteBuilder = (sendMessageToWebView: SendMessageToWebView) => {
	const [mapReady] = useAtom(mapReadyAtom);
	const { location } = useLocationTracking(mapReady);
	const [placedMarkers] = useAtom(placedMarkersAtom);
	const [routePreferences] = useAtom(routePreferencesAtom);
	const [isBuildingRoute, setIsBuildingRoute] = useAtom(isBuildingRouteAtom);
	const setActualRouteDistance = useSetAtom(actualRouteDistanceAtom);

	const handleBuildRouteThroughPlaced = useCallback(async () => {
		if (!mapReady || !location || placedMarkers.length === 0) {
			Alert.alert(
				'Недостаточно данных',
				'Для построения маршрута требуется ваше местоположение и хотя бы одна точка на карте.',
			);
			return;
		}

		if (isBuildingRoute) return;

		setIsBuildingRoute(true);
		setActualRouteDistance(null);
		sendMessageToWebView({ type: 'clearRoute' });
		sendMessageToWebView({ type: 'routeBuildStarted' });

		try {
			const locationsForBackend: Array<{ lat: number; lon: number }> = [
				{ lat: location.latitude, lon: location.longitude },
				...placedMarkers.map(marker => ({
					lat: marker.coordinates[1],
					lon: marker.coordinates[0],
				})),
			];

			const requestData: ValhallaRouteRequest = {
				locations: locationsForBackend,
				costing: 'pedestrian',
				costing_options: {
					pedestrian: {
						use_roads: 0.5,
						use_hills: routePreferences.avoidHills ? 0.2 : 0.7,
						use_ferry: 0.5,
					},
				},
				id: `strollie-route-${uuidv4()}`,
			};

			const routeData: RouteResponse =
				await buildOptimalRoute(requestData);

			if (routeData && routeData.coordinates?.length) {
				sendMessageToWebView({
					type: 'drawRoute',
					payload: {
						coordinates: routeData.coordinates.map(p => [
							p.lon,
							p.lat,
						]),
					},
				});
				setActualRouteDistance(routeData.distance || null);
			} else {
				throw new Error(
					routeData.error ||
						'Не удалось построить маршрут. Попробуйте другие точки или настройки.',
				);
			}
		} catch (error: any) {
			console.error('Ошибка построения маршрута:', error);
			Alert.alert(
				'Ошибка маршрута',
				error.message || 'Неизвестная ошибка',
			);
			sendMessageToWebView({
				type: 'routeBuildError',
				payload: { message: error.message },
			});
		} finally {
			setIsBuildingRoute(false);
		}
	}, [
		mapReady,
		location,
		isBuildingRoute,
		placedMarkers,
		routePreferences,
		sendMessageToWebView,
		setIsBuildingRoute,
		setActualRouteDistance,
	]);

	return { handleBuildRouteThroughPlaced };
};
