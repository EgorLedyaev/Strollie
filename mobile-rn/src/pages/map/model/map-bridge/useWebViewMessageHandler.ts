import { useCallback } from 'react';
import { Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

import type { PlacedMarkerData } from '../marker-store';
import type { FollowMode, UseMapBridgeOptions } from './types';

interface HandlerParams {
	setMapReady: (value: boolean) => void;
	setMapError: (value: string | null) => void;
	setIs3DMode: (value: boolean) => void;
	setPlacedMarkers: (
		updater:
			| PlacedMarkerData[]
			| ((prev: PlacedMarkerData[]) => PlacedMarkerData[]),
	) => void;
	sendMessageToWebView: (message: Record<string, unknown>) => void;
	showMarkerActionMenu: (markerId: string) => void;
	placedMarkers: PlacedMarkerData[];
	location: { latitude: number; longitude: number } | null;
	is3DMode: boolean;
	clearSwitching: () => void;
	setFollowMode: (mode: FollowMode) => void;
	clearAllMarkers: () => void;
	options?: UseMapBridgeOptions;
}

export function useWebViewMessageHandler({
	setMapReady,
	setMapError,
	setIs3DMode,
	setPlacedMarkers,
	sendMessageToWebView,
	showMarkerActionMenu,
	placedMarkers,
	location,
	is3DMode,
	clearSwitching,
	setFollowMode,
	clearAllMarkers,
	options,
}: HandlerParams) {
	const { onMarkerClick, onMapClick } = options || {};

	return useCallback(
		(event: { nativeEvent: { data: string } }) => {
			try {
				const message = JSON.parse(event.nativeEvent.data);
				console.log('[WebView->Native] message', message);

				switch (message.type) {
					case 'mapReady':
						setMapReady(true);
						setMapError(null);
						if (placedMarkers.length > 0) {
							console.log(
								'[WebView->Native] re-add markers after mapReady',
								placedMarkers.length,
							);
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
					case 'mapModeChanged': {
						const modeStr: '2d' | '3d' | undefined =
							message.payload?.mode;
						if (!modeStr) break;

						if (clearSwitching && is3DMode !== (modeStr === '3d')) {
							setIs3DMode(modeStr === '3d');
							clearSwitching();
						}
						break;
					}
					case 'markerClick': {
						const clickedId: string | undefined =
							message.payload?.id;
						if (clickedId) {
							const marker = placedMarkers.find(
								m => m.id === clickedId,
							);
							if (marker && onMarkerClick) {
								onMarkerClick(
									(marker as { placeData?: unknown })
										.placeData,
								);
							} else if (!onMarkerClick) {
								showMarkerActionMenu(clickedId);
							}
						}
						break;
					}
					case 'mapClick': {
						const { coordinates } = message.payload as {
							coordinates: [number, number];
						};
						console.log('[WebView->Native] mapClick', coordinates);
						if (onMapClick) {
							onMapClick(coordinates).then(placeData => {
								console.log(
									'[WebView->Native] mapClick resolved placeData',
									placeData,
								);
								clearAllMarkers();

								if (placeData) {
									const newMarker: PlacedMarkerData = {
										id: uuidv4(),
										coordinates,
										placeData,
									};
									console.log(
										'[WebView->Native] adding marker from mapClick',
										newMarker,
									);
									setPlacedMarkers(() => [newMarker]);
									sendMessageToWebView({
										type: 'addMarker',
										payload: newMarker,
									});

									if (onMarkerClick) {
										onMarkerClick(placeData);
									}
								}
							});
						} else {
							const newMarker: PlacedMarkerData = {
								id: uuidv4(),
								coordinates,
							};
							setPlacedMarkers(prev => [...prev, newMarker]);
							sendMessageToWebView({
								type: 'addMarker',
								payload: newMarker,
							});
						}
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
					case 'userFocusLost':
						setFollowMode('none');
						break;
					case 'followModeChanged': {
						const mode: FollowMode | undefined =
							message.payload?.mode;
						if (
							mode === 'none' ||
							mode === 'center' ||
							mode === 'heading'
						) {
							setFollowMode(mode);
						}
						break;
					}
					case 'followError':
						setFollowMode('none');
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
			is3DMode,
			clearSwitching,
			setFollowMode,
			clearAllMarkers,
			onMarkerClick,
			onMapClick,
		],
	);
}
