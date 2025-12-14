import { useAtomValue } from 'jotai';
import React, { useCallback, useEffect, useRef } from 'react';
import { Alert, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
	PlaceDetailsProvider,
	PlaceDetailsSheet,
	searchPlacesByCoordinates,
	usePlaceDetails,
	type Place,
} from '@/pages/map/place-details';
import { generatedRouteAtom } from '@/entities/generated-route';
import { calculateDistanceMeters, formatDistance } from '@/shared/lib';
import { Colors } from '@/shared/tokens';

import { useMapBridge } from '../model/useMapBridge';
import { MapControls } from './map-controls';
import { MapWidget } from './map-widget';
import { SHADOW_PADDING, WeatherWidget } from './map-widget/WeatherWidget';

function MapPageContent() {
	const insets = useSafeAreaInsets();
	const { setSelectedPlace, resetState } = usePlaceDetails();
	const userLocationRef = useRef<{ lat: number; lon: number } | null>(null);
	const generatedRoute = useAtomValue(generatedRouteAtom);
	const lastRouteIdRef = useRef<string | null>(null);

	const clearPlaceDetails = useCallback(() => {
		resetState();
	}, [resetState]);

	const enhancePlaceWithDistance = useCallback((place: Place): Place => {
		const currentUserLocation = userLocationRef.current;
		if (!currentUserLocation || !place.point) {
			return place;
		}

		const distanceMeters = calculateDistanceMeters(currentUserLocation, {
			lat: place.point.lat,
			lon: place.point.lon,
		});

		const formatted = formatDistance(distanceMeters);

		if (!formatted) {
			return place;
		}

		return {
			...place,
			distance: formatted,
		};
	}, []);

	// Обработчик клика на существующий маркер - переоткрываем sheet с данными
	const handleMarkerClick = useCallback(
		(placeData: unknown) => {
			console.log('Клик на маркер, placeData:', placeData);
			if (placeData) {
				// Приводим к типу Place, т.к. мы сохраняем именно Place в placeData
				const place = placeData as Place;
				console.log('Открываем sheet для места:', place.name);
				setSelectedPlace(enhancePlaceWithDistance(place));
			} else {
				console.warn('placeData отсутствует при клике на маркер');
				clearPlaceDetails();
			}
		},
		[setSelectedPlace, clearPlaceDetails, enhancePlaceWithDistance],
	);

	// Обработчик клика по карте - ищем место и создаём маркер если найдено
	const handleMapClick = useCallback(
		async (coordinates: [number, number]) => {
			try {
				console.log('Поиск места по координатам:', coordinates);
				// Ищем места рядом с координатами (уменьшен радиус для точности)
				const places = await searchPlacesByCoordinates(
					coordinates[1], // lat
					coordinates[0], // lon
					10, // радиус поиска в метрах (уменьшено с 50 до 10)
				);

				console.log('Найдено мест:', places?.length || 0);
				if (places && places.length > 0) {
					const primaryPlace = enhancePlaceWithDistance(places[0]);
					console.log('Место найдено:', primaryPlace.name);
					// Найдено место - возвращаем данные для создания маркера
					return primaryPlace;
				} else {
					console.log('Места не найдены в радиусе 10м');
					clearPlaceDetails();
					// Место не найдено - возвращаем null (маркер не будет создан)
					return null;
				}
			} catch (error) {
				console.error('Ошибка загрузки данных места:', error);
				clearPlaceDetails();
				Alert.alert(
					'Ошибка',
					'Не удалось загрузить данные о месте. Проверьте подключение к интернету.',
				);
				return null;
			}
		},
		[clearPlaceDetails, enhancePlaceWithDistance],
	);

	const {
		webViewRef,
		mapReady,
		is3DMode,
		isLocationAvailable,
		handleWebViewMessage,
		handleZoomIn,
		handleZoomOut,
		toggleMapMode,
		cycleFollowMode,
		handleSearchResultSelect,
		onWebViewLoadStart,
		onWebViewLoadEnd,
		bootstrapScript,
		// Новый стабильный флаг для UI
		uiIs3DMode,
		uiFollowMode,
		clearMarkers,
		userLocation,
		drawRoute,
		clearRoute,
		setMapLocation,
		setMarkers,
	} = useMapBridge({
		onMarkerClick: handleMarkerClick,
		onMapClick: handleMapClick,
	});

	useEffect(() => {
		if (!generatedRoute || !generatedRoute.places?.length) {
			if (lastRouteIdRef.current) {
				clearMarkers();
				clearRoute();
				lastRouteIdRef.current = null;
			}
			return;
		}

		const routeId =
			generatedRoute.directionsUrl ||
			generatedRoute.description ||
			`${generatedRoute.places.length}`;
		lastRouteIdRef.current = routeId;

		const markers = generatedRoute.places.map((place, index) => ({
			id: place.id || `route-place-${index}`,
			coordinates: [place.lon, place.lat] as [number, number],
			title: place.name,
			color: index === 0 ? '#2688EB' : '#FF7A00',
			isRoutePoint: true,
			placeData: place,
		}));

		setMarkers(markers, true);

		if (mapReady) {
			const coordinates = generatedRoute.places.map(
				place => [place.lon, place.lat] as [number, number],
			);
			drawRoute(coordinates);
			setMapLocation(coordinates[0], 14);
		}
	}, [
		clearMarkers,
		clearRoute,
		drawRoute,
		generatedRoute,
		mapReady,
		setMapLocation,
		setMarkers,
	]);

	userLocationRef.current = userLocation;

	const handleSheetDismiss = useCallback(() => {
		clearMarkers();
		clearPlaceDetails();
		clearRoute();
	}, [clearMarkers, clearPlaceDetails, clearRoute]);

	const handleBuildRoute = useCallback(
		(place: Place) => {
			if (!userLocation) {
				Alert.alert(
					'Геолокация недоступна',
					'Для построения маршрута нужно знать текущее местоположение.',
				);
				return;
			}

			const origin: [number, number] = [
				userLocation.lon,
				userLocation.lat,
			];
			const destination: [number, number] = [
				place.point.lon,
				place.point.lat,
			];

			const markers = [
				{
					id: 'route-origin',
					coordinates: origin,
					title: 'Вы здесь',
					color: '#2688EB',
					isRoutePoint: true,
				},
				{
					id: `route-destination-${place.id ?? place.point.lon}-${place.point.lat}`,
					coordinates: destination,
					title: place.name,
					placeData: place,
					color: '#FF7A00',
					isRoutePoint: true,
				},
			];

			setMarkers(markers, true);
			drawRoute([origin, destination]);
			setMapLocation(destination, 14);
		},
		[drawRoute, setMapLocation, setMarkers, userLocation],
	);

	const rightForWeatherWidget = { right: 16 - SHADOW_PADDING };
	const temperature = 16;
	const statusBarHeight =
		insets.top ||
		(Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0);

	return (
		<>
			<SystemBars style='dark' />
			{statusBarHeight > 0 && (
				<View
					pointerEvents='none'
					style={[
						styles.statusBarOverlay,
						{ height: statusBarHeight },
					]}
				/>
			)}
			<MapWidget
				ref={webViewRef}
				onMessage={handleWebViewMessage}
				onLoadStart={onWebViewLoadStart}
				onLoadEnd={onWebViewLoadEnd}
				injectedBootstrapScript={bootstrapScript}
			/>
			<MapControls
				onZoomIn={handleZoomIn}
				onZoomOut={handleZoomOut}
				onToggleMode={toggleMapMode}
				onToggleFollowMode={cycleFollowMode}
				is3DMode={uiIs3DMode ?? is3DMode}
				mapReady={mapReady}
				isLocationAvailable={isLocationAvailable}
				onSearchResultSelect={handleSearchResultSelect}
				followMode={uiFollowMode}
				onProfilePress={handleSheetDismiss}
			/>
			<View style={[styles.weatherContainer, rightForWeatherWidget]}>
				<WeatherWidget temperature={temperature} />
			</View>
			<PlaceDetailsSheet
				onDismiss={handleSheetDismiss}
				onBuildRoute={handleBuildRoute}
			/>
		</>
	);
}

export function MapPage() {
	return (
		<PlaceDetailsProvider>
			<MapPageContent />
		</PlaceDetailsProvider>
	);
}

const styles = StyleSheet.create({
	statusBarOverlay: {
		backgroundColor: Colors.statusBarOverlay,
		left: 0,
		position: 'absolute',
		right: 0,
		top: 0,
		zIndex: 1,
	},
	weatherContainer: {
		position: 'absolute',
		top: Platform.OS === 'ios' ? 120 : 100,
	},
});
