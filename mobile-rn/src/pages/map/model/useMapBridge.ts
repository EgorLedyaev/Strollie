import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import WebView from 'react-native-webview';
import { v4 as uuidv4 } from 'uuid';

import {
	buildBootstrapPayload,
	createBootstrapScript,
	ensureApiKeyPersisted,
	loadPersistedLocation,
	MapBootstrapPayload,
	updateShouldCenterOnUser,
	useLocationTracking,
} from '@/shared/lib';

import { is3DModeAtom, mapErrorAtom, mapReadyAtom } from './map-store';
import { placedMarkersAtom } from './marker-store';

export type FollowMode = 'none' | 'center' | 'heading';

interface UseMapBridgeOptions {
	// Вызывается при клике на существующий маркер, передаёт сохранённые данные места
	onMarkerClick?: (placeData: unknown) => void;
	// Вызывается при клике по карте, должен вернуть данные места или null
	onMapClick?: (coordinates: [number, number]) => Promise<unknown | null>;
}

export function useMapBridge(options?: UseMapBridgeOptions) {
	const { onMarkerClick, onMapClick } = options || {};
	const webViewRef = useRef<WebView>(null);

	const [mapReady, setMapReady] = useAtom(mapReadyAtom);
	const [is3DMode, setIs3DMode] = useAtom(is3DModeAtom);
	const setMapError = useSetAtom(mapErrorAtom);
	const [placedMarkers, setPlacedMarkers] = useAtom(placedMarkersAtom);
	const [isWebViewLoaded, setIsWebViewLoaded] = useState(false);
	const [bootstrapScript, setBootstrapScript] = useState<
		string | undefined
	>();
	const [isBootstrapReady, setIsBootstrapReady] = useState(false);
	const bootstrapPayloadRef = useRef<MapBootstrapPayload | null>(null);
	const hasSentBootstrapRef = useRef(false);

	const { location } = useLocationTracking(mapReady);
	const isLocationAvailable = !!location;

	const sendMessageToWebView = useCallback(
		(message: Record<string, unknown>) => {
			if (webViewRef.current) {
				webViewRef.current.postMessage(JSON.stringify(message));
			}
		},
		[],
	);

	// Шлём user location в WebView при каждом обновлении координат после mapReady
	useEffect(() => {
		if (mapReady && location) {
			const payload = bootstrapPayloadRef.current;
			if (payload) {
				bootstrapPayloadRef.current = {
					...payload,
					userLocation: [location.longitude, location.latitude],
				};
			}
			sendMessageToWebView({
				type: 'updateUserLocation',
				payload: {
					coordinates: [location.longitude, location.latitude],
				},
			});
		}
	}, [mapReady, location, sendMessageToWebView]);

	const [followMode, setFollowMode] = useState<FollowMode>('none');

	// Anti-bounce for 2D/3D switching
	const [isSwitchingMode, setIsSwitchingMode] = useState(false);
	const pendingModeRef = useRef<'2d' | '3d' | null>(null);
	const switchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearSwitching = useCallback(() => {
		pendingModeRef.current = null;
		setIsSwitchingMode(false);
		if (switchTimeoutRef.current) {
			clearTimeout(switchTimeoutRef.current);
			switchTimeoutRef.current = null;
		}
	}, []);

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

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				const envApiKey = process.env.EXPO_PUBLIC_2GIS_API_KEY;
				await ensureApiKeyPersisted(envApiKey);
				let persisted = await loadPersistedLocation();
				if (envApiKey && persisted.apiKey !== envApiKey) {
					persisted = { ...persisted, apiKey: envApiKey };
				}

				if (cancelled) return;

				const payload = buildBootstrapPayload(persisted);
				bootstrapPayloadRef.current = payload;
				const script = createBootstrapScript(payload);
				if (script) {
					setBootstrapScript(script);
					setIsBootstrapReady(true);
				} else {
					setBootstrapScript(undefined);
					setIsBootstrapReady(false);
				}
			} catch (error) {
				console.warn(
					'[useMapBridge] Failed to prepare map bootstrap payload',
					error,
				);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (!isWebViewLoaded || !isBootstrapReady) return;
		const payload = bootstrapPayloadRef.current;
		if (!payload || hasSentBootstrapRef.current) return;

		sendMessageToWebView({ type: 'bootstrapMap', payload });
		hasSentBootstrapRef.current = true;
	}, [isWebViewLoaded, isBootstrapReady, sendMessageToWebView]);

	const handleWebViewMessage = useCallback(
		(event: { nativeEvent: { data: string } }) => {
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
					case 'mapModeChanged': {
						const modeStr: '2d' | '3d' | undefined =
							message.payload?.mode;
						if (!modeStr) break;

						// Если ожидаем подтверждение конкретного режима и пришел другой — игнорируем как дребезг
						if (
							pendingModeRef.current &&
							modeStr !== pendingModeRef.current
						) {
							console.log(
								'[mapModeChanged] Игнорируем противоречащее событие:',
								modeStr,
								'ожидали:',
								pendingModeRef.current,
							);
							break;
						}

						// Подтвердили ожидаемый режим или ожидания нет — применяем
						const nextIs3D = modeStr === '3d';
						if (is3DMode !== nextIs3D) {
							setIs3DMode(nextIs3D);
						}
						// Снимаем флаг переключения
						clearSwitching();
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
								// Передаём сохранённые данные места из маркера
								onMarkerClick(
									(marker as { placeData?: unknown })
										.placeData,
								);
							} else if (!onMarkerClick) {
								// Если нет callback - удаляем как раньше
								handleDeleteMarker(clickedId);
							}
						}
						break;
					}
					case 'mapClick': {
						const { coordinates } = message.payload as {
							coordinates: [number, number];
						};

						console.log(
							'mapClick event, coordinates:',
							coordinates,
						);

						if (onMapClick) {
							// Асинхронно ищем место по координатам
							onMapClick(coordinates).then(placeData => {
								console.log(
									'onMapClick результат:',
									placeData
										? 'Место найдено'
										: 'Место не найдено',
								);

								// Удаляем все старые маркеры
								clearAllMarkers();

								if (placeData) {
									// Место найдено - создаём новый маркер с данными
									const newMarker = {
										id: uuidv4(),
										coordinates,
										placeData, // Сохраняем данные места в маркере
									};
									console.log(
										'Создаём маркер с ID:',
										newMarker.id,
									);
									setPlacedMarkers([newMarker]);
									sendMessageToWebView({
										type: 'addMarker',
										payload: newMarker,
									});

									// Показываем sheet с данными места
									if (onMarkerClick) {
										console.log(
											'Вызываем onMarkerClick для открытия sheet',
										);
										onMarkerClick(placeData);
									}
								} else {
									console.log(
										'placeData === null, маркер не создаётся',
									);
								}
							});
						} else {
							// Fallback - старое поведение если нет onMapClick
							const newMarker = { id: uuidv4(), coordinates };
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
					case 'userFocusGained':
						// keep current mode
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
						} else {
							console.warn(
								'[followModeChanged] Некорректный mode:',
								mode,
							);
						}
						break;
					}
					case 'followError': {
						const reason: string | undefined =
							message.payload?.reason;
						console.warn('[followError] reason:', reason);
						// Возвращаемся в none на любой ошибке
						setFollowMode('none');
						break;
					}
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

	const handleZoomIn = useCallback(() => {
		if (mapReady) sendMessageToWebView({ type: 'zoomIn' });
	}, [mapReady, sendMessageToWebView]);

	const handleZoomOut = useCallback(() => {
		if (mapReady) sendMessageToWebView({ type: 'zoomOut' });
	}, [mapReady, sendMessageToWebView]);

	const toggleMapMode = useCallback(() => {
		if (!mapReady) return;
		if (isSwitchingMode) return; // Блокируем повторные нажатия во время переключения

		const requested: '2d' | '3d' = is3DMode ? '2d' : '3d';
		pendingModeRef.current = requested;
		setIsSwitchingMode(true);

		// Таймаут-фейлсейф: если подтверждение не пришло, снимаем блокировку
		if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
		switchTimeoutRef.current = setTimeout(() => {
			clearSwitching();
		}, 1500);

		sendMessageToWebView({
			type: 'setMapMode',
			payload: { mode: requested },
		});
	}, [
		mapReady,
		is3DMode,
		isSwitchingMode,
		sendMessageToWebView,
		clearSwitching,
	]);

	const updateBootstrapFollowPreference = useCallback(
		(shouldCenter: boolean) => {
			const payload = bootstrapPayloadRef.current;
			if (!payload) return;
			bootstrapPayloadRef.current = {
				...payload,
				centerOnUser: shouldCenter,
				centerOnNextUserFix: shouldCenter,
			};
		},
		[],
	);

	const cycleFollowMode = useCallback(() => {
		if (!mapReady) return;
		setFollowMode(prev => {
			const next: FollowMode =
				prev === 'none'
					? 'center'
					: prev === 'center'
						? 'heading'
						: 'none';
			switch (next) {
				case 'none':
					sendMessageToWebView({ type: 'stopFollow' });
					void updateShouldCenterOnUser(false);
					updateBootstrapFollowPreference(false);
					break;
				case 'center':
					if (!location) {
						Alert.alert(
							'Геолокация недоступна',
							'Невозможно определить ваше местоположение.',
						);
						return prev;
					}
					// Перед стартом follow отправляем актуальную позицию
					sendMessageToWebView({
						type: 'updateUserLocation',
						payload: {
							coordinates: [
								location.longitude,
								location.latitude,
							],
						},
					});
					sendMessageToWebView({ type: 'startFollowUser' });
					void updateShouldCenterOnUser(true);
					updateBootstrapFollowPreference(true);
					break;
				case 'heading':
					if (!location) {
						Alert.alert(
							'Геолокация недоступна',
							'Невозможно определить ваше местоположение.',
						);
						return prev;
					}
					sendMessageToWebView({
						type: 'updateUserLocation',
						payload: {
							coordinates: [
								location.longitude,
								location.latitude,
							],
						},
					});
					sendMessageToWebView({ type: 'startFollowHeading' });
					void updateShouldCenterOnUser(true);
					updateBootstrapFollowPreference(true);
					break;
			}
			return next;
		});
	}, [
		mapReady,
		location,
		sendMessageToWebView,
		updateBootstrapFollowPreference,
	]);

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

	const handleWebViewLoadStart = useCallback(() => {
		setIsWebViewLoaded(false);
		hasSentBootstrapRef.current = false;
	}, []);

	const handleWebViewLoadEnd = useCallback(() => {
		setIsWebViewLoaded(true);
	}, []);

	return {
		webViewRef,
		mapReady,
		is3DMode,
		isLocationAvailable,
		clearMarkers: clearAllMarkers,
		// В UI показываем 'none', если геолокация недоступна
		uiFollowMode: isLocationAvailable ? followMode : 'none',
		followMode,
		handleWebViewMessage,
		handleZoomIn,
		handleZoomOut,
		toggleMapMode,
		cycleFollowMode,
		handleSearchResultSelect,
		onWebViewLoadStart: handleWebViewLoadStart,
		onWebViewLoadEnd: handleWebViewLoadEnd,
		isBootstrapReady,
		bootstrapScript,
		// Показываем в UI целевой режим во время переключения
		uiIs3DMode: isSwitchingMode
			? pendingModeRef.current === '3d'
			: is3DMode,
	} as const;
}
