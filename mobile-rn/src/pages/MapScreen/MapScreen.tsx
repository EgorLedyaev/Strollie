import { MapControlsOverlay } from '@/src/components/MapControlsOverlay';
import { MapStatusIndicator } from '@/src/components/MapStatusIndicator';
import { EditableRoutePointsList } from '@/src/features/map/ui/EditableRoutePointsList';
import {
	RoutePreferences,
	RouteSettingsPanel,
} from '@/src/features/map/ui/RouteSettingsPanel';
import { useLocationTracking } from '@/src/hooks/useLocationTracking';
import { loadMapHtml } from '@/src/pages/MapScreen/mapService';
import {
	RouteResponse,
	buildOptimalRoute,
	ValhallaRouteRequest,
} from '@/src/pages/MapScreen/routeService';
import { Colors, Fonts, Radius } from '@/src/shared/tokens';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	ActionSheetIOS,
	ActivityIndicator,
	Alert,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import 'react-native-get-random-values';
import { WebView } from 'react-native-webview';
import { v4 as uuidv4 } from 'uuid';

type WebViewRef = WebView | null;

/**
 * Интерфейс сообщения, отправляемого в WebView
 */
interface WebViewMessage {
	/** Тип команды */
	type: string;
	/** Дополнительные данные команды */
	payload?: Record<string, any>;
}

interface WebViewMessageEvent {
	nativeEvent: {
		data: string;
	};
}

/**
 * Интерфейс данных о размещенном на карте маркере
 */
export interface PlacedMarkerData {
	/** Уникальный идентификатор маркера */
	id: string;
	/** Координаты маркера в формате [долгота, широта] */
	coordinates: [number, number]; // [lon, lat]
}

export default function MapScreen() {
	const [is3DMode, setIs3DMode] = useState(false);
	const webViewRef = useRef<WebViewRef>(null);
	const [mapReady, setMapReady] = useState(false);
	const [mapError, setMapError] = useState<string | null>(null);
	const [htmlContent, setHtmlContent] = useState<string | null>('');

	const { location, locationError } = useLocationTracking(mapReady);
	const [isBuildingRoute, setIsBuildingRoute] = useState(false);
	const [placedMarkers, setPlacedMarkers] = useState<PlacedMarkerData[]>([]);

	const [routePreferences, setRoutePreferences] = useState<RoutePreferences>({
		preferParks: false,
		avoidHills: true,
		walkingSpeed: 5,
		desiredDistance: 5.0,
	});
	const [isSettingsPanelVisible, setIsSettingsPanelVisible] = useState(false);
	const [actualRouteDistance, setActualRouteDistance] = useState<
		number | null
	>(null);
	const [isEditPointsPanelVisible, setIsEditPointsPanelVisible] =
		useState(false);

	const sendMessageToWebView = useCallback((message: WebViewMessage) => {
		if (!webViewRef.current) {
			console.warn('WebView ref not ready to send message:', message);
			return;
		}
		
		// Логирование всех сообщений для отладки
		console.log('Sending to WebView:', message.type, message.payload);

		webViewRef.current.postMessage(JSON.stringify(message));
	}, []);

	useEffect(() => {
		if (mapReady && location) {
			sendMessageToWebView({
				type: 'updateUserLocation',
				payload: {
					coordinates: [location.longitude, location.latitude], // [lon, lat]
				},
			});
		}
	}, [location, mapReady, sendMessageToWebView]);

	useEffect(() => {
		if (locationError) {
			console.warn('Location Error:', locationError);
		}
	}, [locationError]);

	// Загрузка HTML
	useEffect(() => {
		loadMapHtml().then(html => setHtmlContent(html ?? null));
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
		[sendMessageToWebView],
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
		(event: WebViewMessageEvent) => {
			try {
				const message = JSON.parse(event.nativeEvent.data);
				console.log('Message from WebView:', message);
				
				switch (message.type) {
					case 'mapReady':
						setMapReady(true);
						setMapError(null);
						
						// Восстанавливаем состояние карты после загрузки
						if (placedMarkers.length > 0) {
							// Отправляем все сохраненные маркеры на карту
							placedMarkers.forEach(marker => {
								sendMessageToWebView({
									type: 'addMarker',
									payload: marker,
								});
							});
						}
						
						// Показываем текущее местоположение пользователя
						if (location) {
							sendMessageToWebView({
								type: 'updateUserLocation',
								payload: {
									coordinates: [location.longitude, location.latitude], // [lon, lat]
								},
							});
						}
						break;
						
					case 'mapError':
						setMapError(message.payload?.message || 'Неизвестная ошибка карты');
						setMapReady(false);
						break;
						
					case 'mapModeChanged':
						setIs3DMode(message.payload?.mode === '3d');
						break;
						
					case 'mapClick': {
						const { coordinates } = message.payload as { coordinates: [number, number] };
						
						// Создаем новый маркер с уникальным ID
						const newMarker: PlacedMarkerData = {
							id: uuidv4(),
							coordinates, // [lon, lat]
						};
						
						// Добавляем маркер в состояние и отправляем на карту
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
						console.error('JavaScript Error in WebView:', message.payload?.message);
						setMapError(`JS Error: ${message.payload?.message || 'Неизвестная JS ошибка'}`);
						break;
						
					case 'routeDrawSuccess':
						console.log("Маршрут успешно отрисован в WebView");
						break;
						
					case 'routeDrawError':
						Alert.alert("Ошибка отрисовки", message.payload?.message || 'WebView не смог отрисовать маршрут');
						break;

					case 'log':
						console.log(
							'WebView Log:',
							message.payload?.message,
							message.payload?.data,
						);
					break;
					default:
						console.warn('Неизвестный тип сообщения от WebView:', message.type);
				}
			} catch (error) {
				console.error('Ошибка при разборе сообщения от WebView:', error);
			}
		},
		[sendMessageToWebView, showMarkerActionMenu, placedMarkers, location],
	);

	// Функции управления картой
	const handleZoomIn = useCallback(() => {
		if (mapReady) {
			sendMessageToWebView({ type: 'zoomIn', payload: {} });
		}
	}, [mapReady, sendMessageToWebView]);

	const handleZoomOut = useCallback(() => {
		if (mapReady) {
			sendMessageToWebView({ type: 'zoomOut', payload: {} });
		}
	}, [mapReady, sendMessageToWebView]);

	const toggleMapMode = useCallback(() => {
		if (mapReady) {
			const newMode = !is3DMode;
			// Не обновляем состояние напрямую - оно изменится по событию mapModeChanged из WebView
			sendMessageToWebView({
				type: 'setMapMode',
				payload: { mode: newMode ? '3d' : '2d' },
			});
		}
	}, [mapReady, is3DMode, sendMessageToWebView]);

	const handleNavigate = useCallback(() => {
		if (mapReady && location) {
			sendMessageToWebView({
				type: 'centerOnUser', payload: {
					coordinates: [location.longitude, location.latitude], // [lon, lat]
				
			} });
		} else if (mapReady && !location) {
			Alert.alert(
				'Геолокация недоступна',
				'Невозможно определить ваше местоположение.'
			);
		}
	}, [mapReady, location, sendMessageToWebView]);

	const handleSearchResultSelect = useCallback(
		(coordinates: [number, number], addressText: string) => {
			if (mapReady) {
				// Центрирование карты на выбранных координатах с заданным зумом
				sendMessageToWebView({
					type: 'setMapLocation',
					payload: { center: coordinates, zoom: 16 },
				});
				
				// Добавление маркера по результатам поиска
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

	/**
	 * Построение маршрута через указанные точки
	 */
	const handleBuildRouteThroughPlaced = useCallback(
		async (
			currentPrefs: RoutePreferences = routePreferences,
			currentPoints: PlacedMarkerData[] = placedMarkers,
		) => {
			const pointsToUse = currentPoints;
			
			// Проверка необходимых условий для построения маршрута
			if (!mapReady || !location || pointsToUse.length === 0) {
				Alert.alert(
					'Недостаточно данных',
					'Для построения маршрута требуется ваше местоположение и хотя бы одна точка на карте.'
				);
				return;
			}
			
			// Защита от повторных вызовов
			if (isBuildingRoute) return;

			// Начинаем процесс построения маршрута
			setIsBuildingRoute(true);
			setActualRouteDistance(null);
			sendMessageToWebView({ type: 'clearRoute' });
			sendMessageToWebView({ type: 'routeBuildStarted' });

			try {
				const locationsForBackend: Array<{ lat: number; lon: number }> =
					[
						{ lat: location.latitude, lon: location.longitude },
						...pointsToUse.map(marker => ({
							lat: marker.coordinates[1],
							lon: marker.coordinates[0],
						})),
					];

				const requestData: ValhallaRouteRequest = {
					locations: locationsForBackend,
					costing: 'pedestrian',
					costing_options: {
						pedestrian: {
							// Примерные настройки
							use_roads: 0.5,
							use_hills: currentPrefs.avoidHills ? 0.2 : 0.7,
							use_ferry: 0.5,
							// Другие возможные параметры
						},
					},
					id: `strollie-route-${uuidv4()}`,
				};

				console.log('RN: Sending route request to backend...');
				const routeData: RouteResponse =
					await buildOptimalRoute(requestData);					// Обработка успешного ответа
				if (routeData && routeData.coordinates?.length) {
					// ИСПРАВЛЕНО: Отправляем только координаты без лишних полей
					sendMessageToWebView({
						type: 'drawRoute',
						payload: {
							coordinates: routeData.coordinates.map(p => [p.lon, p.lat]), // [lon, lat]
						},
					});
					setActualRouteDistance(routeData.distance || null);
				} else {
					throw new Error(routeData.error || 
						'Не удалось построить маршрут. Попробуйте другие точки или настройки.'
					);
				}
			} catch (error: any) {
				console.error('Ошибка построения маршрута:', error);
				Alert.alert('Ошибка маршрута', error.message || 'Неизвестная ошибка');
				sendMessageToWebView({ 
					type: 'routeBuildError', 
					payload: { message: error.message } 
				});
			} finally {
				setIsBuildingRoute(false);
			}
		},
		[
			mapReady,
			location,
			isBuildingRoute,
			placedMarkers,
			sendMessageToWebView,
		],
	);

	const handleReorderPoints = useCallback(
		(newOrderedPoints: PlacedMarkerData[]) => {
			setPlacedMarkers(newOrderedPoints);
			if (mapReady && location && newOrderedPoints.length > 0) {
				handleBuildRouteThroughPlaced(routePreferences, newOrderedPoints);
			}
		},
		[mapReady, location, routePreferences, handleBuildRouteThroughPlaced],
	);

	const handleDeleteSinglePoint = useCallback((markerId: string) => {
		// Удаляем точку из локального состояния
		const newPoints = placedMarkers.filter(m => m.id !== markerId);
		setPlacedMarkers(newPoints);
		
		// Удаляем маркер с карты
		sendMessageToWebView({ 
			type: 'removeMarker', 
			payload: { markerId } 
		});
		
		// Перестраиваем маршрут, если остались точки
		if (mapReady && location && newPoints.length > 0) {
			handleBuildRouteThroughPlaced(routePreferences, newPoints);
		} else if (newPoints.length === 0) {
			// Очищаем маршрут, если точек не осталось
			sendMessageToWebView({ type: 'clearRoute' });
			setActualRouteDistance(null);
		}
	}, [mapReady, location, placedMarkers, routePreferences, sendMessageToWebView, handleBuildRouteThroughPlaced]);

	const handleDeleteAllPoints = useCallback(() => {
		// Очищаем все маркеры с карты
		sendMessageToWebView({ type: 'clearMarkers' });
		setPlacedMarkers([]);
		
		// Очищаем маршрут
		sendMessageToWebView({ type: 'clearRoute' });
		setActualRouteDistance(null);
		
		// Закрываем панель редактирования точек
		setIsEditPointsPanelVisible(false);
	}, [sendMessageToWebView]);

	const webviewUrl = process.env.EXPO_PUBLIC_WEBVIEW_URL;
	if (!webviewUrl) {
		return (
			<View style={styles.errorView}>
				<Text style={styles.errorText}>
					Не задан URL для WebView в переменных окружения
				</Text>
			</View>
		);
	}

	if (htmlContent === null) {
		return (
			<View style={styles.errorView}>
				<Text style={styles.errorText}>Ошибка загрузки HTML</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<WebView
				ref={webViewRef}
				source={{
					uri: `http://${webviewUrl}`,
				}}
				style={styles.webview}
				onMessage={handleWebViewMessage}
				javaScriptEnabled={true}
				domStorageEnabled={true}
				originWhitelist={['*']}
				mixedContentMode='always'
				scrollEnabled={false}
				scalesPageToFit={false}
				allowsInlineMediaPlayback={true}
				mediaPlaybackRequiresUserAction={false}
				allowFileAccess={true}
				onError={syntheticEvent => {
					const { nativeEvent } = syntheticEvent;
					setMapError(
						`WebView Error: ${nativeEvent.description}`
					);
				}}
			/>

			<MapStatusIndicator mapReady={mapReady} mapError={mapError} />

			<MapControlsOverlay
				is3DMode={is3DMode}
				mapReady={mapReady}
				isLocationAvailable={!!location}
				onZoomIn={handleZoomIn}
				onZoomOut={handleZoomOut}
				onToggleMode={toggleMapMode}
				onNavigate={handleNavigate}
				onSearchResultSelect={handleSearchResultSelect}
			/>

			<EditableRoutePointsList
				points={placedMarkers}
				onReorder={handleReorderPoints}
				onDeletePoint={handleDeleteSinglePoint}
				onDeleteAll={handleDeleteAllPoints}
				isVisible={isEditPointsPanelVisible}
				onClose={() => setIsEditPointsPanelVisible(false)}
			/>

			{mapReady && (
				<TouchableOpacity
					style={styles.settingsButton}
					onPress={() => setIsSettingsPanelVisible(prev => !prev)}
				>
					<Text style={styles.settingsButtonText}>Настройки</Text>
				</TouchableOpacity>
			)}

			{mapReady && (
				<TouchableOpacity
					style={styles.editPointsButton}
					onPress={() => setIsEditPointsPanelVisible(prev => !prev)}
				>
					<Text style={styles.editPointsButtonText}>Точки</Text>
				</TouchableOpacity>
			)}

			<RouteSettingsPanel
				initialPreferences={routePreferences}
				onPreferencesChange={setRoutePreferences}
				isVisible={isSettingsPanelVisible}
				onClose={() => setIsSettingsPanelVisible(false)}
				actualRouteDistance={actualRouteDistance}
			/>

			<View style={styles.buildRouteButtonContainer}>
				<TouchableOpacity
					style={[
						styles.buildRouteButton,
						(!mapReady ||
							!location ||
							placedMarkers.length === 0 ||
							isBuildingRoute) &&
							styles.buttonDisabled,
					]}
					onPress={() => handleBuildRouteThroughPlaced()}
					disabled={
						!mapReady ||
						!location ||
						placedMarkers.length === 0 ||
						isBuildingRoute
					}
				>
					{isBuildingRoute ? (
						<ActivityIndicator color={Colors.white} size='small' />
					) : (
						<Text style={styles.buildRouteButtonText}>
							Маршрут ({placedMarkers.length})
						</Text>
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: Colors.lightBackground },
	webview: { flex: 1, opacity: 1 },
	webviewLoading: {
		flex: 1,
		opacity: 0,
		position: 'absolute',
		top: 0,
		left: 0,
		width: 1,
		height: 1,
	},
	webViewContainer: { flex: 1 },
	errorView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.lightBackground,
	},
	errorText: {
		color: Colors.error,
		fontFamily: Fonts.medium,
		fontSize: 16,
		textAlign: 'center',
		marginHorizontal: 20,
	},

	buildRouteButtonContainer: {
		position: 'absolute',
		bottom: 30,
		left: 20,
		right: 20,
		alignItems: 'center',
		pointerEvents: 'box-none',
	},
	buildRouteButton: {
		backgroundColor: Colors.greenPrimary,
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: Radius.r15,
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		pointerEvents: 'auto',
		minHeight: 48,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonDisabled: {
		backgroundColor: Colors.gray,
	},
	buildRouteButtonText: {
		color: Colors.black,
		fontSize: 16,
		fontFamily: Fonts.semibold,
	},
	settingsButton: {
		position: 'absolute',
		bottom: 30,
		left: 20,
		alignSelf: 'flex-start',
		backgroundColor: Colors.lightBackground,
		padding: 10,
		paddingHorizontal: 15,
		borderRadius: Radius.r10,
	},
	settingsButtonText: {
		color: Colors.black,
		fontFamily: Fonts.semibold,
		fontSize: 16,
	},

	editPointsButton: {
		position: 'absolute',
		bottom: 30,
		right: 20,
		alignSelf: 'flex-end',
		backgroundColor: Colors.lightBackground,
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: Radius.r10,
		elevation: 6,
		zIndex: 10,
	},
	editPointsButtonText: {
		color: Colors.black,
		fontFamily: Fonts.semibold,
		fontSize: 16,
	},
});
