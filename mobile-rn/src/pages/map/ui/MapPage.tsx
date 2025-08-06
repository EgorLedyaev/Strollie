import { useAtom, useSetAtom } from 'jotai';
import React, { useCallback, useRef, useState } from 'react';
import {
	ActionSheetIOS,
	Alert,
	Platform,
	StyleSheet,
	View,
} from 'react-native';

import { is3DModeAtom, mapErrorAtom, mapReadyAtom } from '@/entities/map';
import { placedMarkersAtom } from '@/entities/marker';
import { useLocationTracking } from '@/shared/lib';

import { MapControls } from './map-controls';
import { MapWidget } from './map-widget';

import 'react-native-get-random-values';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { v4 as uuidv4 } from 'uuid';

import { type PlacedMarkerData } from '@/entities/marker';
import { Colors, Shadows } from '@/shared/tokens';

import { useRouteBuilder } from '../model/use-route-builder';
import { SHADOW_PADDING, WeatherWidget } from './map-widget/WeatherWidget';

export function MapPage() {
	const webViewRef = useRef<WebView>(null);
	const [mapReady, setMapReady] = useAtom(mapReadyAtom);
	const [is3DMode, setIs3DMode] = useAtom(is3DModeAtom);
	const setMapError = useSetAtom(mapErrorAtom);
	const [placedMarkers, setPlacedMarkers] = useAtom(placedMarkersAtom);

	const { location } = useLocationTracking(mapReady);

	const rightForWeatherWidget = { right: 16 - SHADOW_PADDING };

	const sendMessageToWebView = useCallback((message: any) => {
		if (webViewRef.current) {
			webViewRef.current.postMessage(JSON.stringify(message));
		}
	}, []);

	const { handleBuildRouteThroughPlaced } =
		useRouteBuilder(sendMessageToWebView);

	const handleDeleteMarker = useCallback(
		(idToDelete: string | null) => {
			if (idToDelete) {
				sendMessageToWebView({
					type: 'removeMarker',
					payload: { markerId: idToDelete },
				});
				setPlacedMarkers(prev => prev.filter(m => m.id !== idToDelete));
			}
		},
		[sendMessageToWebView, setPlacedMarkers],
	);

	const showMarkerActionMenu = useCallback(
		(markerId: string) => {
			if (Platform.OS === 'ios') {
				ActionSheetIOS.showActionSheetWithOptions(
					{
						options: ['Отмена', 'Удалить'],
						destructiveButtonIndex: 1,
						cancelButtonIndex: 0,
						title: `Метка ${markerId.substring(0, 6)}...`,
					},
					buttonIndex => {
						if (buttonIndex === 1) handleDeleteMarker(markerId);
					},
				);
			} else {
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
			}
		},
		[handleDeleteMarker],
	);

	const handleWebViewMessage = useCallback(
		(event: any) => {
			try {
				const message = JSON.parse(event.nativeEvent.data);
				console.log('Message from WebView:', message);

				switch (message.type) {
					case 'mapReady':
						setMapReady(true);
						setMapError(null);
						if (placedMarkers.length > 0) {
							placedMarkers.forEach(marker => {
								sendMessageToWebView({
									type: 'addMarker',
									payload: marker,
								});
							});
						}
						if (location) {
							sendMessageToWebView({
								type: 'updateUserLocation',
								payload: {
									coordinates: [
										location.longitude,
										location.latitude,
									],
								},
							});
						}
						break;
					case 'mapError':
						setMapError(
							message.payload?.message ||
								'Неизвестная ошибка карты',
						);
						setMapReady(false);
						break;
					case 'mapModeChanged':
						setIs3DMode(message.payload?.mode === '3d');
						break;
					case 'mapClick': {
						const { coordinates } = message.payload as {
							coordinates: [number, number];
						};
						const newMarker = {
							id: uuidv4(),
							coordinates,
						};
						setPlacedMarkers(prev => [...prev, newMarker]);
						sendMessageToWebView({
							type: 'addMarker',
							payload: newMarker,
						});
						break;
					}
					case 'longPressOnMarker':
						showMarkerActionMenu(message.payload.markerId);
						break;
					case 'jsError':
						console.error(
							'JavaScript Error in WebView:',
							message.payload?.message,
						);
						setMapError(
							`JS Error: ${message.payload?.message || 'Неизвестная JS ошибка'}`,
						);
						break;
					case 'routeDrawSuccess':
						console.log('Маршрут успешно отрисован в WebView');
						break;
					case 'routeDrawError':
						Alert.alert(
							'Ошибка отрисовки',
							message.payload?.message ||
								'WebView не смог отрисовать маршрут',
						);
						break;
					case 'log':
						console.log(
							'WebView Log:',
							message.payload?.message,
							message.payload?.data,
						);
						break;
					default:
						console.warn(
							'Неизвестный тип сообщения от WebView:',
							message.type,
						);
				}
			} catch (error) {
				console.error(
					'Ошибка при разборе сообщения от WebView:',
					error,
				);
			}
		},
		[
			setMapReady,
			setMapError,
			setIs3DMode,
			setPlacedMarkers,
			sendMessageToWebView,
			showMarkerActionMenu,
			placedMarkers,
			location,
		],
	);

	const handleZoomIn = useCallback(() => {
		if (mapReady) sendMessageToWebView({ type: 'zoomIn' });
	}, [mapReady, sendMessageToWebView]);

	const handleZoomOut = useCallback(() => {
		if (mapReady) sendMessageToWebView({ type: 'zoomOut' });
	}, [mapReady, sendMessageToWebView]);

	const toggleMapMode = useCallback(() => {
		if (mapReady) {
			const newMode = !is3DMode;
			sendMessageToWebView({
				type: 'setMapMode',
				payload: { mode: newMode ? '3d' : '2d' },
			});
		}
	}, [mapReady, is3DMode, sendMessageToWebView]);

	const handleNavigate = useCallback(() => {
		if (mapReady && location) {
			sendMessageToWebView({
				type: 'centerOnUser',
				payload: {
					coordinates: [location.longitude, location.latitude],
				},
			});
		} else if (mapReady && !location) {
			Alert.alert(
				'Геолокация недоступна',
				'Невозможно определить ваше местоположение.',
			);
		}
	}, [mapReady, location, sendMessageToWebView]);

	const handleSearchResultSelect = useCallback(
		(coordinates: [number, number], addressText: string) => {
			if (mapReady) {
				sendMessageToWebView({
					type: 'setMapLocation',
					payload: { center: coordinates, zoom: 16 },
				});
				sendMessageToWebView({
					type: 'addMarker',
					payload: {
						id: `search-${uuidv4()}`,
						coordinates,
						title: addressText,
					},
				});
			}
		},
		[mapReady, sendMessageToWebView],
	);

	const [temperature, setTemperature] = useState(16);

	return (
		<>
			<StatusBar style='dark' backgroundColor={Colors.optionHighlight} />
			<MapWidget ref={webViewRef} onMessage={handleWebViewMessage} />
			<MapControls
				onZoomIn={handleZoomIn}
				onZoomOut={handleZoomOut}
				onToggleMode={toggleMapMode}
				onNavigate={handleNavigate}
				is3DMode={is3DMode}
				mapReady={mapReady}
				isLocationAvailable={!!location}
				onSearchResultSelect={handleSearchResultSelect}
			/>
			<View style={[styles.weatherContainer, rightForWeatherWidget]}>
				<WeatherWidget temperature={temperature} />
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	weatherContainer: {
		position: 'absolute',
		top: Platform.OS === 'ios' ? 120 : 100,
	},
});
