import mapHtmlTemplate from '@/assets/html/map-template.html';
import LocationIcon from '@/assets/icons/map/LocationIcon';
import MinusIcon from '@/assets/icons/map/MinusIcon';
import PlusIcon from '@/assets/icons/map/PlusIcon';
import { ProfileButton } from '@/src/features/layout/ui/ProfileButton/ProfileButton';
import { Colors, Fonts, Gaps, Radius } from '@/src/shared/tokens';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

// Определяем типы
type LocationCoords = Location.LocationObjectCoords;
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

export async function loadMapHtml() {
	try {
		const asset = Asset.fromModule(mapHtmlTemplate);
		await asset.downloadAsync();

		return await FileSystem.readAsStringAsync(asset.localUri as string);
	} catch (error) {
		console.error('Error loading HTML template:', error);
		return null;
	}
}

export default function MapScreen() {
	const [is3DMode, setIs3DMode] = useState(false);
	const webViewRef = useRef<WebViewRef>(null);
	const [location, setLocation] = useState<LocationCoords | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [mapReady, setMapReady] = useState(false);
	const [mapError, setMapError] = useState<string | null>(null);
	const [, setRouteDrawStatus] = useState<string>('');
	const [htmlContent, setHtmlContent] = useState<string | null>('');
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		loadMapHtml().then(html => setHtmlContent(html ?? null));
	}, []);

	useEffect(() => {
		let watchSub: Location.LocationSubscription | null = null;

		(async () => {
			const { status } =
				await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}
			try {
				const currentLocation = await Location.getCurrentPositionAsync(
					{},
				);
				setLocation(currentLocation.coords);
				if (mapReady && webViewRef.current) {
					sendMessageToWebView({
						type: 'updateLocation',
						payload: {
							lat: currentLocation.coords.latitude,
							lon: currentLocation.coords.longitude,
						},
					});
				}
			} catch (e) {
				console.error('Error getting initial location', e);
				setErrorMsg('Could not get initial location');
			}

			watchSub = await Location.watchPositionAsync(
				{
					accuracy: Location.Accuracy.High,
					timeInterval: 5000,
					distanceInterval: 10,
				},
				newLocation => {
					setLocation(newLocation.coords);
					if (mapReady && webViewRef.current) {
						sendMessageToWebView({
							type: 'updateLocation',
							payload: {
								lat: newLocation.coords.latitude,
								lon: newLocation.coords.longitude,
							},
						});
					}
				},
			);
		})();

		return () => {
			if (watchSub) {
				watchSub.remove();
			}
		};
	}, [mapReady]);

	// Типизируем функцию отправки сообщений
	const sendMessageToWebView = (message: WebViewMessage) => {
		if (webViewRef.current) {
			webViewRef.current.postMessage(JSON.stringify(message));
		} else {
			console.warn('WebView ref not ready to send message:', message);
		}
	};

	// Типизируем обработчик сообщений
	const handleWebViewMessage = (event: WebViewMessageEvent) => {
		try {
			const message = JSON.parse(event.nativeEvent.data);
			console.log('Message from WebView:', message);
			switch (message.type) {
				case 'mapReady':
					setMapReady(true);
					setMapError(null);
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
					setMapError(message.payload || 'Unknown map error');
					setMapReady(false);
					break;
				case 'customRouteSuccess':
					setRouteDrawStatus('Route drawn successfully!');
					break;
				case 'customRouteError':
					setRouteDrawStatus(
						`Error drawing route: ${message.payload}`,
					);
					break;
				case 'jsError':
					console.error(
						'JavaScript Error in WebView:',
						message.payload,
					);
					setMapError(
						`JS Error: ${message.payload?.message || 'Unknown JS error'}`,
					);
					break;
				case 'searchError':
					if (message.payload === 'Ключ API Поиска не установлен') {
						console.warn('Search API key is missing in WebView');
						// Можно показать некритичное уведомление пользователю один раз
					} else {
						console.error(
							'Search error from WebView:',
							message.payload,
						);
					}
					break;
			}
		} catch (error) {
			console.error(
				'Failed to parse message from WebView or handle it:',
				error,
			);
		}
	};

	// Обработчики для новых кнопок
	const handleZoomIn = () => {
		if (mapReady) {
			sendMessageToWebView({ type: 'zoomIn' });
		}
	};

	const handleZoomOut = () => {
		if (mapReady) {
			sendMessageToWebView({ type: 'zoomOut' });
		}
	};

	const toggleMapMode = () => {
		if (mapReady) {
			const newMode = !is3DMode;
			setIs3DMode(newMode);
			sendMessageToWebView({
				type: 'setMapMode',
				payload: { mode: newMode ? '3d' : '2d' },
			});
		}
	};

	const handleNavigate = () => {
		if (mapReady && location) {
			sendMessageToWebView({ type: 'startNavigation' });
		}
	};

	if (htmlContent === null) {
		return (
			<View style={styles.loader}>
				<Text>Error loading map resources.</Text>
			</View>
		); // Показываем ошибку, если HTML не загрузился
	}
	if (htmlContent === '') {
		return (
			<View style={styles.loader}>
				<ActivityIndicator size='large' />
				<Text>Preparing map...</Text>
			</View>
		); // Показываем индикатор, пока HTML грузится
	}

	return (
		<View style={styles.container}>
			<WebView
				ref={webViewRef}
				source={{ html: htmlContent }}
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
			{!mapReady && (
				<View style={styles.loader}>
					<ActivityIndicator
						size='large'
						color={Colors.greenPrimary}
					/>
					<Text style={styles.loaderText}>
						{mapError ? 'Ошибка карты' : 'Загрузка карты...'}
					</Text>
					{mapError && (
						<Text style={styles.errorText}>{mapError}</Text>
					)}
				</View>
			)}
			<SafeAreaView
				style={styles.overlayContainer}
				pointerEvents='box-none'
			>
				<View style={styles.header} pointerEvents='box-none'>
					<ProfileButton href={'/profile'} pointerEvents='auto' />
					<View style={styles.headerSpacer} />
				</View>

				<View
					style={styles.mapControlsWrapper}
					pointerEvents='box-none'
				>
					<View style={styles.mapControls} pointerEvents='auto'>
						<TouchableOpacity
							style={[styles.mapButton, styles.mapButtonPlus]}
							onPress={handleZoomIn}
							disabled={!mapReady}
						>
							<PlusIcon />
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.mapButton, styles.mapButtonMinus]}
							onPress={handleZoomOut}
							disabled={!mapReady}
						>
							<MinusIcon />
						</TouchableOpacity>
					</View>

					<View
						style={styles.mapModeControls}
						pointerEvents='box-none'
					>
						<TouchableOpacity
							style={[
								styles.mapButton,
								is3DMode ? styles.activeButton : {},
							]}
							onPress={toggleMapMode}
							disabled={!mapReady}
						>
							<Text
								style={[
									styles.mapButtonText,
									is3DMode ? styles.activeButtonText : {},
								]}
							>
								{is3DMode ? '3D' : '2D'}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.mapButton}
							onPress={handleNavigate}
							disabled={!mapReady || !location}
						>
							<LocationIcon width={24} height={24} />
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		</View>
	);
}

// Вынесем цвета в константы для исправления ESLint ошибок
const COLORS = {
	loaderBackground: 'rgba(255,255,255,0.8)',
	controlsBackground: '#fff',
	controlsBorder: '#ccc',
	routeInfo: 'blue',
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: Colors.lightBackground },
	webview: { flex: 1, opacity: 1 },
	loader: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: COLORS.loaderBackground,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loaderText: {
		marginTop: 10,
		fontSize: 16,
		color: Colors.black,
	},
	errorText: {
		color: Colors.red,
		marginTop: 5,
		textAlign: 'center',
		fontSize: 12,
	},
	// Контейнер для всех UI элементов поверх карты
	overlayContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		pointerEvents: 'box-none',
		flex: 1,
		paddingTop: Platform.OS === 'android' ? 10 : 0, // Отступ сверху для Android, т.к. SafeAreaView может не покрывать статус бар
	},
	header: {
		paddingHorizontal: 16,
		flexDirection: 'row',
		paddingTop: 10, // Отступ сверху внутри SafeAreaView
	},
	webViewContainer: {
		flex: 1,
	},
	headerSpacer: {
		flex: 1,
	},
	mapControlsWrapper: {
		position: 'absolute',
		top: '40%',
		right: 16,
		alignItems: 'flex-end',
		gap: Gaps.g16,
	},
	mapControls: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		// Добавим тень для лучшей видимости
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 3,
	},
	mapModeControls: {
		gap: Gaps.g16, // Уменьшим гэп
		alignItems: 'flex-end', // Кнопки будут справа
	},
	mapButton: {
		width: 46,
		height: 46,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.white, // Фон по умолчанию
		borderRadius: Radius.r15, // Используем токен
		// Тень для отдельных кнопок
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 3,
	},
	mapButtonPlus: {
		// Стили для кнопки + (верхняя часть сгруппированных)
		borderBottomRightRadius: 0,
		borderBottomLeftRadius: 0,
		// Убираем тень снизу, т.к. кнопки соединены
		shadowOffset: { width: 0, height: 0 },
		elevation: 0, // Убираем elevation для соединенных кнопок
	},
	mapButtonMinus: {
		// Стили для кнопки - (нижняя часть сгруппированных)
		borderTopRightRadius: 0,
		borderTopLeftRadius: 0,
		borderTopWidth: 1, // Разделитель
		borderTopColor: Colors.gray,
	},
	activeButton: {
		backgroundColor: Colors.greenPrimary, // Цвет активной кнопки
	},
	mapButtonText: {
		fontSize: 16, // Сделаем текст чуть больше
		fontFamily: Fonts.regular, // Используем medium шрифт
		color: Colors.black, // Цвет текста по умолчанию
	},
	activeButtonText: {
		color: Colors.black, // Цвет текста активной кнопки
	},
});
