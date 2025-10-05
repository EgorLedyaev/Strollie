import React, { useCallback } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';

import {
	PlaceDetailsProvider,
	PlaceDetailsSheet,
	searchPlacesByCoordinates,
	usePlaceDetails,
} from '@/pages/map/place-details';

import { useMapBridge } from '../model/useMapBridge';
import { MapControls } from './map-controls';
import { MapWidget } from './map-widget';
import { SHADOW_PADDING, WeatherWidget } from './map-widget/WeatherWidget';

function MapPageContent() {
	const { setSelectedPlace, resetState } = usePlaceDetails();

	const clearPlaceDetails = useCallback(() => {
		resetState();
	}, [resetState]);

	// Обработчик клика на существующий маркер - переоткрываем sheet с данными
	const handleMarkerClick = useCallback(
		(placeData: unknown) => {
			console.log('Клик на маркер, placeData:', placeData);
			if (placeData) {
				// Приводим к типу Place, т.к. мы сохраняем именно Place в placeData
				const place =
					placeData as import('@/pages/map/place-details').Place;
				console.log('Открываем sheet для места:', place.name);
				setSelectedPlace(place);
			} else {
				console.warn('placeData отсутствует при клике на маркер');
				clearPlaceDetails();
			}
		},
		[setSelectedPlace, clearPlaceDetails],
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
					console.log('Место найдено:', places[0].name);
					// Найдено место - возвращаем данные для создания маркера
					return places[0];
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
		[clearPlaceDetails],
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
	} = useMapBridge({
		onMarkerClick: handleMarkerClick,
		onMapClick: handleMapClick,
	});

	const handleSheetDismiss = useCallback(() => {
		clearMarkers();
		clearPlaceDetails();
	}, [clearMarkers, clearPlaceDetails]);

	const rightForWeatherWidget = { right: 16 - SHADOW_PADDING };
	const temperature = 16;

	return (
		<>
			<SystemBars style='dark' />
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
			/>
			<View style={[styles.weatherContainer, rightForWeatherWidget]}>
				<WeatherWidget temperature={temperature} />
			</View>
			<PlaceDetailsSheet onDismiss={handleSheetDismiss} />
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
	weatherContainer: {
		position: 'absolute',
		top: Platform.OS === 'ios' ? 120 : 100,
	},
});
