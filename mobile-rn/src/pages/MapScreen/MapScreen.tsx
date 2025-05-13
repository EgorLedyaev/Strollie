import { MapControlsOverlay } from '@/src/components/MapControlsOverlay';
import { MapStatusIndicator } from '@/src/components/MapStatusIndicator';
import {
	RoutePreferences,
	RouteSettingsPanel,
} from '@/src/features/map/ui/RouteSettingsPanel';
import { useLocationTracking } from '@/src/hooks/useLocationTracking';
import { loadMapHtml } from '@/src/pages/MapScreen/mapService';
import {
	RouteResponse,
	buildOptimalRoute,
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

// Определим интерфейсы для сообщений
interface WebViewMessage {
	type: string;
	payload?: unknown;
}

interface WebViewMessageEvent {
	nativeEvent: {
		data: string;
	};
}

interface PlacedMarkerData {
	id: string;
	coordinates: [number, number]; // [lon, lat]
	// Можно добавить title, color и т.д., если нужно хранить в RN
}

interface LngLat {
	lon: number;
	lat: number;
}

export default function MapScreen() {
	const [is3DMode, setIs3DMode] = useState(false);
	const webViewRef = useRef<WebViewRef>(null);
	const [mapReady, setMapReady] = useState(false);
	const [mapError, setMapError] = useState<string | null>(null);
	const [htmlContent, setHtmlContent] = useState<string | null>('');
	const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(
		null,
	);

	const { location, locationError } = useLocationTracking(mapReady); // Включаем только когда карта готова
	const [isBuildingRoute, setIsBuildingRoute] = useState(false);
	const [placedMarkers, setPlacedMarkers] = useState<PlacedMarkerData[]>([]);

	const [routePreferences, setRoutePreferences] = useState<RoutePreferences>({
		preferParks: false,
		avoidHills: true, // Изначально избегаем холмов, как у тебя было
		walkingSpeed: 5, // Средняя скорость пешехода
		desiredDistance: 5.0,
	});
	const [isSettingsPanelVisible, setIsSettingsPanelVisible] = useState(false); // Для показа/скрытия
	const [actualRouteDistance, setActualRouteDistance] = useState<
		number | null
	>(null);

	const handlePreferencesChange = useCallback(
		(newPreferences: RoutePreferences) => {
			// Сначала обновляем локальное состояние предпочтений
			setRoutePreferences(newPreferences);
			// Затем, если условия позволяют, сразу перестраиваем маршрут
			if (mapReady && location && placedMarkers.length > 0) {
				console.log(
					'[RN]: Preferences changed, rebuilding route with new preferences:',
					newPreferences,
				);
				handleBuildRouteThroughPlaced(newPreferences);
			} else {
				console.log(
					'[RN]: Preferences changed, but conditions not met for immediate rebuild:',
					newPreferences,
				);
			}
		},
		// Зависимости: mapReady, location, placedMarkers нужны для условия перестроения.
		// handleBuildRouteThroughPlaced будет вызван с новыми newPreferences,
		// поэтому его текущее состояние routePreferences внутри него не так критично для этого useCallback,
		// но лучше его включить, если он как-то косвенно использует routePreferences из замыкания.
		// Для чистоты, лучше чтобы handleBuildRouteThroughPlaced всегда брал preferences как аргумент.
		[
			mapReady,
			location,
			placedMarkers,
			sendMessageToWebView,
			routePreferences,
		], // Добавил routePreferences для полноты
	);
	// Загрузка HTML
	useEffect(() => {
		loadMapHtml().then(html => setHtmlContent(html ?? null));
	}, []);

	// Отправка обновлений геолокации в WebView
	useEffect(() => {
		if (mapReady && location && webViewRef.current) {
			sendMessageToWebView({
				type: 'updateLocation',
				payload: { lat: location.latitude, lon: location.longitude },
			});
		}
	}, [location, mapReady]); // Зависим от location и mapReady

	useEffect(() => {
		if (locationError) {
			console.warn('Location Error:', locationError);
			// Alert.alert("Ошибка геолокации", locationError); // Пример
		}
	}, [locationError]);
	// Типизируем функцию отправки сообщений
	const sendMessageToWebView = useCallback((message: WebViewMessage) => {
		if (webViewRef.current) {
			webViewRef.current.postMessage(JSON.stringify(message));
		} else {
			console.warn('WebView ref not ready to send message:', message);
		}
	}, []); // Пустой массив зависимостей, т.к. webViewRef не меняется

	const handleDeleteMarker = useCallback(
		(idToDelete: string | null) => {
			if (idToDelete) {
				console.log(
					`RN: Sending remove command for marker ${idToDelete}`,
				);
				sendMessageToWebView({
					type: 'removeMarker',
					payload: { markerId: idToDelete },
				});
				// Обновляем состояние RN
				setPlacedMarkers(prev => prev.filter(m => m.id !== idToDelete));
			} else {
				console.warn('RN: handleDeleteMarker called with null ID!');
			}
			setSelectedMarkerId(null);
		},
		[sendMessageToWebView],
	);

	const showMarkerActionMenu = useCallback(
		(markerId: string) => {
			// useCallback здесь не обязателен, но оставим
			setSelectedMarkerId(markerId);
			// Логика ActionSheetIOS / Alert остается прежней, но вызывает handleDeleteMarker с markerId
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
						else setSelectedMarkerId(null);
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
						{
							text: 'Отмена',
							onPress: () => setSelectedMarkerId(null),
							style: 'cancel',
						},
					],
					{
						cancelable: true,
						onDismiss: () => setSelectedMarkerId(null),
					},
				);
			}
		},
		[handleDeleteMarker],
	); // Теперь зависит от handleDeleteMarker

	const handleWebViewMessage = useCallback(
		(event: WebViewMessageEvent) => {
			try {
				const message = JSON.parse(event.nativeEvent.data);
				console.log('Message from WebView:', message); // Можно оставить для отладки
				switch (message.type) {
					case 'mapReady':
						setMapReady(true);
						setMapError(null);
						console.log(
							'[RN]: Map is ready. Restoring markers if any.',
						);
						if (placedMarkers.length > 0) {
							console.log(
								`[RN]: Restoring ${placedMarkers.length} markers.`,
							);
							placedMarkers.forEach(marker => {
								sendMessageToWebView({
									type: 'addMarker',
									// Убедись, что payload соответствует тому, что ожидает addPlacedMarker в WebView
									payload: {
										id: marker.id,
										coordinates: marker.coordinates,
										// title: marker.title, // если есть
										// color: marker.color, // если есть
									},
								});
							});
						}
						// Отправка текущей геолокации, если она уже есть
						if (location) {
							sendMessageToWebView({
								type: 'updateLocation',
								payload: {
									lat: location.latitude,
									lon: location.longitude,
								},
							});
						}
						break;
					case 'mapError':
						setMapError(
							(message.payload as string) || 'Unknown map error',
						);
						setMapReady(false);
						break;
					case 'longPressOnMap':
						if (
							message.payload &&
							Array.isArray(
								(message.payload as any).coordinates,
							) &&
							(message.payload as any).coordinates.length >= 2
						) {
							const coords = (message.payload as any)
								.coordinates as [number, number];
							const newMarkerId = uuidv4(); // Генерируем ID здесь
							const newMarkerData: PlacedMarkerData = {
								id: newMarkerId,
								coordinates: coords,
							};
							const newMarkerPayload = {
								...newMarkerData,
								color: 'violet',
							}; // Данные для WebView

							// 1. Добавляем метку в состояние RN
							setPlacedMarkers(prev => [...prev, newMarkerData]);

							// 2. Отправляем команду на добавление в WebView
							sendMessageToWebView({
								type: 'addMarker',
								payload: newMarkerPayload,
							});
						}
						break;
					case 'longPressOnMarker':
						if (
							message.payload &&
							typeof (message.payload as any).markerId ===
								'string'
						) {
							showMarkerActionMenu(
								(message.payload as any).markerId,
							);
						}
						break;
					case 'routeBuildStarted':
						setIsBuildingRoute(true);
						break;
					case 'routeBuildSuccess':
						setIsBuildingRoute(false);
						break; // Успех
					case 'routeBuildError':
						console.error(
							'RN: Route build error:',
							message.payload,
						);
						setIsBuildingRoute(false);
						Alert.alert(
							'Ошибка маршрута',
							(message.payload as string) || 'Неизвестная ошибка',
						);
						break;
					case 'routeDrawStarted': // Новое событие от WebView
						console.log('RN: Route drawing started in WebView');
						// Можно добавить доп. индикацию
						break;
					case 'routeDrawSuccess': // Новое событие от WebView
						console.log('RN: Route drawing successful in WebView');
						setIsBuildingRoute(false); // Завершаем индикацию
						break;
					case 'routeDrawError': // Новое событие от WebView
						console.error(
							'RN: Route drawing error from WebView:',
							message.payload,
						);
						setIsBuildingRoute(false);
						Alert.alert(
							'Ошибка отрисовки маршрута',
							(message.payload as string) || 'Неизвестная ошибка',
						);
						break;
					case 'jsError':
						console.error(
							'JavaScript Error in WebView:',
							message.payload,
						);
						// Показываем только сообщение об ошибке
						setMapError(
							`JS Error: ${message.payload?.message || 'Unknown JS error'}`,
						);
						break;
					// Другие обработчики ('customRouteSuccess', etc.), если нужны
				}
			} catch (error) {
				console.error(
					'Failed to parse message from WebView or handle it:',
					error,
				);
			}
		},
		[sendMessageToWebView, showMarkerActionMenu, placedMarkers, location],
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
			setIs3DMode(newMode);
			sendMessageToWebView({
				type: 'setMapMode',
				payload: { mode: newMode ? '3d' : '2d' },
			});
		}
	}, [mapReady, is3DMode, sendMessageToWebView]);

	const handleNavigate = useCallback(() => {
		if (mapReady && location)
			sendMessageToWebView({ type: 'startNavigation' });
		// Добавляем else для обратной связи
		else if (mapReady && !location)
			console.log('Navigate pressed, but location is not available yet.');
	}, [mapReady, location, sendMessageToWebView]);

	const handleBuildRouteThroughPlaced = useCallback(
		async (currentPrefs?: RoutePreferences) => {
			const prefsToUse = currentPrefs || routePreferences;
			if (!mapReady) {
				Alert.alert('Карта не готова');
				return;
			}
			if (!location) {
				Alert.alert('Нет геолокации');
				return;
			}
			if (
				placedMarkers.length === 0 &&
				!(prefsToUse === routePreferences && currentPrefs === undefined)
			) {
				if (currentPrefs === undefined) {
					// Значит вызов был от кнопки "Маршрут"
					Alert.alert(
						'Нет меток',
						'Поставьте хотя бы одну метку долгим нажатием.',
					);
				}
				return;
			}
			if (isBuildingRoute) return;

			console.log('RN: Requesting route from SERVER');
			setIsBuildingRoute(true);
			setActualRouteDistance(null);
			sendMessageToWebView({ type: 'clearRoute' });

			try {
				const locationsForBackend: Array<{ lat: number; lon: number }> =
					[
						{ lat: location.latitude, lon: location.longitude }, // Начальная точка
						...placedMarkers.map(marker => ({
							lat: marker.coordinates[1], // Lat из [lon, lat]
							lon: marker.coordinates[0], // Lon из [lon, lat]
						})),
					];

				// Формируем объект запроса к твоему бэкенду
				const requestDataForBackend = {
					locations: locationsForBackend,
					costing: 'pedestrian', // Указываем нужный тип
					preferences: prefsToUse,
				};

				console.log(
					`RN: Sending request to backend API. Точек: ${requestDataForBackend.locations.length}, режим: ${requestDataForBackend.costing}`,
				);

				// Вызываем твой сервис, который теперь шлет запрос на твой бэкенд

				const routeData: RouteResponse = await buildOptimalRoute(
					requestDataForBackend,
				);

				console.log(
					`RN: Received route from backend with ${routeData.coordinates?.length || 0} points, distance: ${routeData.distance || 'unknown'}km`,
				);

				// --- Обработка ответа (остается такой же) ---
				if (
					routeData &&
					routeData.coordinates &&
					Array.isArray(routeData.coordinates) &&
					routeData.coordinates.length >= 2
				) {
					console.log(
						'RN: Sending drawServerRoute command to WebView',
					);
					sendMessageToWebView({
						type: 'drawServerRoute',
						payload: {
							coordinates: routeData.coordinates, // Массив [lon, lat] от бэкенда
							startCoordinates: [
								location.longitude,
								location.latitude,
							], // Старт для маркера
						},
					});
					setActualRouteDistance(routeData.distance || null);
				} else {
					// Обрабатываем ошибку, если бэкенд ее вернул в поле error
					const errorMessage =
						routeData?.error ||
						'Некорректный ответ от бэкенд-сервиса.';
					console.error('RN: Backend error:', errorMessage);
					throw new Error(errorMessage);
				}
			} catch (error: any) {
				console.error('RN: Failed to get route from backend:', error);
				setIsBuildingRoute(false);
				Alert.alert(
					'Ошибка маршрутизации',
					error.message || 'Не удалось связаться с сервером.',
				);
				sendMessageToWebView({
					type: 'routeBuildError',
					payload: error.message || 'Ошибка связи с сервером',
				});
			} finally {
				setIsBuildingRoute(false); // Сбрасываем флаг в любом случае
			}
		},
		[
			mapReady,
			location,
			isBuildingRoute,
			placedMarkers,
			sendMessageToWebView,
			routePreferences,
		],
	);

	if (htmlContent === null) {
		return (
			<View style={styles.errorView}>
				<Text>Ошибка загрузки ресурсов карты.</Text>
			</View>
		);
	}
	if (htmlContent === '') {
		return (
			<View style={styles.container}>
				{/* Показываем WebView в фоне, чтобы он мог инициализироваться */}
				{htmlContent !== '' && (
					<WebView
						ref={webViewRef}
						source={{ html: htmlContent }}
						style={styles.webviewLoading} // Стиль, чтобы скрыть его визуально
						onMessage={handleWebViewMessage}
						// ... остальные необходимые props WebView ...
						javaScriptEnabled={true}
						domStorageEnabled={true}
						originWhitelist={['*']}
						allowFileAccess={true}
						injectedJavaScriptBeforeContentLoaded={`/* ... JS для ошибок ... */ true;`}
						onError={() => setMapError('Ошибка загрузки WebView')} // Простая обработка ошибки загрузки
					/>
				)}
				{/* Индикатор поверх */}
				<MapStatusIndicator mapReady={mapReady} mapError={mapError} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<WebView
				ref={webViewRef}
				source={{
					uri: `http://${process.env.EXPO_PUBLIC_WEBVIEW_URL}`,
				}}
				style={styles.webview}
				onMessage={handleWebViewMessage}
				javaScriptEnabled={true}
				domStorageEnabled={true}
				originWhitelist={['*']}
				mixedContentMode='always'
				scrollEnabled={false} // Важно для кар
				scalesPageToFit={false} // Важно для правильной обработки жестов
				containerStyle={styles.webViewContainer}
				contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
				allowsInlineMediaPlayback={true} // Может понадобиться для некоторых функций
				mediaPlaybackRequiresUserAction={false} // Тоже может понадобиться
				allowFileAccess={true} // Разрешаем доступ к файлам (для локального HTML)
				// --- Важный инжект для отлова ошибок JS внутри WebView ---
				injectedJavaScriptBeforeContentLoaded={`
  window.onerror = function(message, sourcefile, lineno, colno, error) {
    if (message !== "Script error." || (sourcefile && sourcefile !== "")) {
      const errorData = {
        message: message,
        sourcefile: sourcefile,
        lineno: lineno,
        colno: colno,
        error: error ? error.stack : 'Нет стека вызовов'
      };
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'jsError',
        payload: errorData
      }));
    }
    return true;
  };
  
  // Более избирательный перехват console.error
  const originalConsoleError = console.error;
  console.error = (...args) => {
    originalConsoleError.apply(console, args);
    
    // Не отправляем ошибки стрингификации объектов или рутинные сообщения
    const errorMsg = args.map(arg => String(arg)).join(' ');
    if (!errorMsg.includes('[object Object]') && !errorMsg.includes('ReactNativeWebView')) {
      try {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'jsError',
          payload: { message: errorMsg }
        }));
      } catch (e) {
        // Игнорируем ошибки отправки
      }
    }
  };
  true;
`}
				onError={syntheticEvent => {
					const { nativeEvent } = syntheticEvent;
					console.warn('WebView error: ', nativeEvent); // Логируем полное событие для отладки
					setMapError(
						`WebView Error: ${nativeEvent.description} (Code: ${nativeEvent.code})`,
					);
					setMapReady(false);
				}}
				onLoadEnd={() => console.log('WebView onLoadEnd')}
				onHttpError={syntheticEvent => {
					// Добавим обработчик HTTP ошибок
					const { nativeEvent } = syntheticEvent;
					console.warn(
						'WebView HTTP Error: ',
						nativeEvent.statusCode,
						nativeEvent.url,
						nativeEvent.description,
					);
				}}
			/>

			{/* Показываем лоадер или сообщение об ошибке поверх WebView */}
			<MapStatusIndicator mapReady={mapReady} mapError={mapError} />

			{/* Оверлей с контролами */}
			<MapControlsOverlay
				is3DMode={is3DMode}
				mapReady={mapReady}
				isLocationAvailable={!!location} // Передаем флаг доступности локации
				onZoomIn={handleZoomIn}
				onZoomOut={handleZoomOut}
				onToggleMode={toggleMapMode}
				onNavigate={handleNavigate}
				// profileHref="/profile" // Можно передать, если нужно
			/>
			{mapReady && ( // Показываем кнопку только когда карта готова
				<TouchableOpacity
					style={styles.settingsButton}
					onPress={() => setIsSettingsPanelVisible(prev => !prev)}
				>
					<Text style={styles.settingsButtonText}>Настройки</Text>
				</TouchableOpacity>
			)}

			<RouteSettingsPanel
				initialPreferences={routePreferences}
				onPreferencesChange={handlePreferencesChange}
				isVisible={isSettingsPanelVisible}
				onClose={() => setIsSettingsPanelVisible(false)} // Передаем обработчик закрытия
				actualRouteDistance={actualRouteDistance} // Передаем актуальную длину маршрута
			/>
			<View style={styles.buildRouteButtonContainer}>
				<TouchableOpacity
					style={[
						styles.buildRouteButton,
						// Блокируем, если нет меток
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
							{/* Новый текст кнопки */}
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
	}, // Стиль для скрытого WebView во время загрузки
	webViewContainer: { flex: 1 },
	errorView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.lightBackground,
	}, // Стиль для ошибки загрузки HTML

	buildRouteButtonContainer: {
		position: 'absolute',
		bottom: 30, // Отступ снизу
		left: 20,
		right: 20,
		alignItems: 'center', // Центрируем кнопку
		pointerEvents: 'box-none', // Контейнер пропускает касания
	},
	buildRouteButton: {
		backgroundColor: Colors.greenPrimary, // Цвет кнопки
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: Radius.r15, // Используем ваш радиус
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		pointerEvents: 'auto', // Кнопка принимает касания
		minHeight: 48, // Минимальная высота для удобства нажатия
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonDisabled: {
		backgroundColor: Colors.gray, // Цвет неактивной кнопки
	},
	buildRouteButtonText: {
		color: Colors.black, // Цвет текста на кнопке
		fontSize: 16,
		fontFamily: Fonts.semibold, // Используем ваш шрифт
	},
	settingsButton: {
		position: 'absolute',
		bottom: 100, // Выше кнопки "Маршрут" и панели
		alignSelf: 'center',
		backgroundColor: Colors.lightBackground, // Пример
		padding: 10,
		paddingHorizontal: 15,
		borderRadius: Radius.r10,
	},
	settingsButtonText: {
		color: Colors.black,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
	},
});
