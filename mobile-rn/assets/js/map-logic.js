// Весь ваш JavaScript код отсюда:
let mapInstance;
let userMarker = null;
let userMarkerElement = null;
let currentCustomRouteFeature = null;
let placedMarkersById = {};
let YMapDefaultMarkerClass = null; // Для маркеров по умолчанию

let longPressTimer = null;
const LONG_PRESS_DURATION = 700;
let pressStartTime = 0;
let pressStartCoordsGeo = null;
let pressStartCoordsScreen = null;
const MOVE_THRESHOLD = 10;

// --- Функции ---
function showError(message) {
	const errorDisplay = document.getElementById('error-display');
	if (errorDisplay) {
		errorDisplay.textContent = message;
		errorDisplay.style.display = 'block';
	}
	console.error('Map Error:', message);
	sendMessageToReactNative({ type: 'mapError', payload: message });
}

function sendMessageToReactNative(message) {
	if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
		window.ReactNativeWebView.postMessage(JSON.stringify(message));
	} else {
		console.log(
			'ReactNativeWebView.postMessage not available, message:',
			message,
		);
	}
}

function addPlacedMarker(payload) {
	if (!mapInstance || !payload || !payload.coordinates) return;
	const { coordinates, id, title, subtitle, color } = payload;

	console.log(`WebView: Adding marker ${id} at`, coordinates);
	removePlacedMarker(id); // Удаляем старый, если есть

	let marker;
	if (YMapDefaultMarkerClass) {
		try {
			marker = new YMapDefaultMarkerClass({
				coordinates: coordinates,
				title: title || `Метка ${id}`,
				color: color || 'red',
				zIndex: 5,
			});
		} catch (e) {
			console.error(
				'Error creating YMapDefaultMarker for placed marker:',
				e,
			);
			const markerElem = document.createElement('div');
			markerElem.style.cssText =
				'width:15px;height:15px;background:red;border-radius:50%;border:2px solid white;box-shadow:0 0 3px black;';
			marker = new ymaps3.YMapMarker(
				{ coordinates, zIndex: 5 },
				markerElem,
			);
		}
	} else {
		const markerElem = document.createElement('div');
		markerElem.style.cssText =
			'width:15px;height:15px;background:red;border-radius:50%;border:2px solid white;box-shadow:0 0 3px black;';
		marker = new ymaps3.YMapMarker({ coordinates, zIndex: 5 }, markerElem);
	}

	try {
		mapInstance.addChild(marker);
		placedMarkersById[id] = marker;
	} catch (e) {
		console.error(`WebView: Failed to add marker ${id} to map:`, e);
	}
}

function removePlacedMarker(markerId) {
	if (mapInstance && placedMarkersById[markerId]) {
		try {
			mapInstance.removeChild(placedMarkersById[markerId]);
			console.log(`WebView: Removed marker ${markerId}`);
		} catch (e) {
			console.warn(`WebView: Could not remove marker ${markerId}:`, e);
		}
		delete placedMarkersById[markerId];
	}
}

function handleReactNativeMessage(event) {
	try {
		const message = JSON.parse(event.data);
		// console.log('WebView received message from RN:', message); // Раскомментировать для отладки
		switch (message.type) {
			case 'updateLocation':
				if (
					message.payload &&
					typeof message.payload.lat === 'number' &&
					typeof message.payload.lon === 'number'
				) {
					updateUserLocationMarker(
						message.payload.lat,
						message.payload.lon,
					);
				}
				break;
			case 'drawCustomRoute':
				if (
					message.payload &&
					Array.isArray(message.payload.coordinates)
				) {
					drawCustomRoute(message.payload.coordinates);
				}
				break;
			case 'zoomIn':
				if (mapInstance && typeof mapInstance.zoom === 'number') {
					mapInstance.update({
						location: { zoom: mapInstance.zoom + 1, duration: 300 },
					});
				}
				break;
			case 'zoomOut':
				if (mapInstance && typeof mapInstance.zoom === 'number') {
					mapInstance.update({
						location: { zoom: mapInstance.zoom - 1, duration: 300 },
					});
				}
				break;
			case 'setMapMode':
				if (
					mapInstance &&
					message.payload &&
					typeof message.payload.mode === 'string'
				) {
					const tiltInRadians =
						message.payload.mode === '3d'
							? 45 * (Math.PI / 180)
							: 0;
					mapInstance.update({
						camera: { tilt: tiltInRadians, duration: 500 },
					});
					if (message.payload.mode === '3d') {
						mapInstance.update({ mode: 'vector' });
					}
					// else { mapInstance.update({ mode: 'auto' }); } // Можно вернуть auto если нужно
				}
				break;
			case 'startNavigation':
				if (userMarker && mapInstance && userMarker.coordinates) {
					mapInstance.update({
						location: {
							center: userMarker.coordinates,
							zoom: 17,
							duration: 500,
						},
					});
					sendMessageToReactNative({ type: 'navigationStarted' });
				}
				break;
			case 'addMarker':
				if (
					message.payload &&
					message.payload.coordinates &&
					message.payload.id
				) {
					addPlacedMarker(message.payload);
				} else {
					console.warn('Invalid payload for addMarker');
				}
				break;
			default:
				console.warn(
					'WebView received unknown message type:',
					message.type,
				);
		}
	} catch (error) {
		console.error('Failed to handle RN message:', error);
		showError('Ошибка обработки команды: ' + error.message);
	}
}

function updateUserLocationMarker(lat, lon) {
	if (!mapInstance || typeof ymaps3 === 'undefined' || !ymaps3.YMapMarker) {
		console.warn('updateUserLocationMarker: Map or YMapMarker not ready.');
		return;
	}
	const userLocation = [lon, lat];
	try {
		if (!userMarkerElement) {
			userMarkerElement = document.createElement('div');
			userMarkerElement.className = 'user-marker';
		}
		if (!userMarker) {
			console.log('Creating user marker at:', userLocation);
			userMarker = new ymaps3.YMapMarker(
				{ coordinates: userLocation, zIndex: 10 },
				userMarkerElement,
			);
			mapInstance.addChild(userMarker);
		} else {
			userMarker.update({ coordinates: userLocation });
		}
	} catch (e) {
		console.error('Error updating user marker:', e);
		showError('Ошибка обновления маркера пользователя: ' + e.message);
	}
}

function drawCustomRoute(coordinatesLatLon) {
	if (!mapInstance || typeof ymaps3 === 'undefined' || !ymaps3.YMapFeature) {
		showError('Map components not ready for drawing route.');
		return;
	}
	if (currentCustomRouteFeature) {
		try {
			mapInstance.removeChild(currentCustomRouteFeature);
		} catch (e) {
			console.warn('Could not remove previous route:', e);
		}
		currentCustomRouteFeature = null;
	}
	if (!coordinatesLatLon || coordinatesLatLon.length < 2) {
		showError('Not enough coordinates for route.');
		return;
	}
	const coordinatesLonLat = coordinatesLatLon.map(coord => [
		coord[1],
		coord[0],
	]);

	try {
		currentCustomRouteFeature = new ymaps3.YMapFeature({
			id: 'custom_route_' + Date.now(),
			geometry: { type: 'LineString', coordinates: coordinatesLonLat },
			style: { stroke: [{ width: 4, color: '#FF0000' }], zIndex: 5 },
		});
		mapInstance.addChild(currentCustomRouteFeature);
		mapInstance.update({
			location: { center: coordinatesLonLat[0], zoom: 14, duration: 300 },
		});
		console.log('Custom route drawn.');
		sendMessageToReactNative({ type: 'customRouteSuccess' });
	} catch (error) {
		console.error('Failed to draw custom route:', error);
		showError(error.message || 'Error drawing route');
	}
}

// --- Логика долгого нажатия ---
function clearLongPressTimer() {
	if (longPressTimer) {
		clearTimeout(longPressTimer);
		longPressTimer = null;
	}
	pressStartTime = 0;
	pressStartCoordsGeo = null;
	pressStartCoordsScreen = null;
}

function handlePointerDown(obj, event) {
	clearLongPressTimer();
	pressStartTime = Date.now();
	pressStartCoordsGeo = event.coordinates;
	pressStartCoordsScreen = event.screenCoordinates;

	longPressTimer = setTimeout(() => {
		console.log('Long press detected at:', pressStartCoordsGeo);
		sendMessageToReactNative({
			type: 'longPressOnMap',
			payload: { coordinates: pressStartCoordsGeo },
		});
		longPressTimer = null;
		pressStartTime = 0;
		pressStartCoordsGeo = null;
		pressStartCoordsScreen = null; // Reset after fire
	}, LONG_PRESS_DURATION);
}

function handlePointerMove(obj, event) {
	if (!longPressTimer || !pressStartCoordsScreen) return;
	const dx = event.screenCoordinates[0] - pressStartCoordsScreen[0];
	const dy = event.screenCoordinates[1] - pressStartCoordsScreen[1];
	if (Math.sqrt(dx * dx + dy * dy) > MOVE_THRESHOLD) {
		clearLongPressTimer();
	}
}

function handlePointerUp(obj, event) {
	clearLongPressTimer();
}
// --- КОНЕЦ ЛОГИКИ ДОЛГОГО НАЖАТИЯ ---

// --- Инициализация карты ---
async function initMap() {
	try {
		if (typeof ymaps3 === 'undefined')
			throw new Error('Yandex Maps API (ymaps3) not loaded.');
		await ymaps3.ready;
		console.log('WebView: ymaps3.ready resolved.');

		const {
			YMap,
			YMapDefaultSchemeLayer,
			YMapDefaultFeaturesLayer,
			YMapMarker,
			YMapFeature,
			YMapListener,
		} = ymaps3;

		// Загрузка маркеров по умолчанию
		try {
			const DefaultMarkerModule = await ymaps3.import(
				'@yandex/ymaps3-default-ui-theme',
			);
			YMapDefaultMarkerClass = DefaultMarkerModule.YMapDefaultMarker;
			console.log('WebView: Default UI theme package loaded.');
		} catch (e) {
			console.warn(
				'WebView: Could not load @yandex/ymaps3-default-ui-theme package.',
				e,
			);
			YMapDefaultMarkerClass = null;
		}

		mapInstance = new YMap(
			document.getElementById('map'),
			{
				location: { center: [37.6176, 55.7558], zoom: 10 },
				mode: 'vector',
				behaviors: [
					'drag',
					'pinchZoom',
					'scrollZoom',
					'dblClickZoom',
					'multiTouch',
				], // Основные поведения
			},
			[new YMapDefaultSchemeLayer({}), new YMapDefaultFeaturesLayer({})],
		);

		// Добавление слушателя событий карты
		const mapListener = new YMapListener({
			layer: 'any',
			onPointerDown: handlePointerDown,
			onPointerMove: handlePointerMove,
			onPointerUp: handlePointerUp,
			// onTouchStart: handlePointerDown, // Можно дублировать для надежности на моб.
			// onTouchMove: handlePointerMove,
			// onTouchEnd: handlePointerUp,
		});
		mapInstance.addChild(mapListener);

		document.getElementById('error-display').style.display = 'none';
		console.log('WebView: Map initialized successfully.');
		sendMessageToReactNative({ type: 'mapReady' });

		// Слушатели сообщений от RN
		document.addEventListener('message', handleReactNativeMessage);
		window.addEventListener('message', handleReactNativeMessage);
	} catch (error) {
		console.error('WebView: Map initialization failed:', error);
		showError(error.message || 'Не удалось инициализировать карту');
	}
}

// --- Запуск ---
// Добавим проверку на документ (на случай раннего вызова)
if (
	document.readyState === 'complete' ||
	document.readyState === 'interactive'
) {
	if (typeof ymaps3 !== 'undefined' && ymaps3.ready) {
		initMap();
	} else {
		// Если API еще не готово, дождемся его в событии load
		window.addEventListener('load', waitForApiAndInit);
	}
} else {
	document.addEventListener('DOMContentLoaded', () => {
		// DOM загружен, ждем API
		window.addEventListener('load', waitForApiAndInit);
	});
}

function waitForApiAndInit() {
	if (typeof ymaps3 !== 'undefined' && ymaps3.ready) {
		initMap();
	} else {
		// Можно добавить небольшой таймаут и повторную проверку,
		// но если после load API нет, скорее всего, проблема с загрузкой
		console.error('API Yandex Maps не доступно после события window.load.');
		showError('Не удалось загрузить API Яндекс Карт.');
	}
}
