import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import WebView from 'react-native-webview';
import { v4 as uuidv4 } from 'uuid';

import {
	buildBootstrapPayload,
	createBootstrapScript,
	ensureApiKeyPersisted,
	loadPersistedLocation,
	MapBootstrapPayload,
	useLocationTracking,
} from '@/shared/lib';

import type { UseMapBridgeOptions } from './map-bridge/types';
import { useFollowMode } from './map-bridge/useFollowMode';
import { useMarkerActions } from './map-bridge/useMarkerActions';
import { useWebViewMessageHandler } from './map-bridge/useWebViewMessageHandler';
import { is3DModeAtom, mapErrorAtom, mapReadyAtom } from './map-store';
import { placedMarkersAtom, type PlacedMarkerData } from './marker-store';

export function useMapBridge(options?: UseMapBridgeOptions) {
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
	const hasCenteredOnUserRef = useRef(false);

	const { location, heading, headingAvailable } =
		useLocationTracking(mapReady);
	const isLocationAvailable = !!location;

	const sendMessageToWebView = useCallback(
		(message: Record<string, unknown>) => {
			console.log('[Native->WebView] send', message);
			if (webViewRef.current) {
				webViewRef.current.postMessage(JSON.stringify(message));
			} else {
				console.warn('[Native->WebView] no webViewRef available');
			}
		},
		[],
	);

	// Шлём статус доступности компаса в WebView
	useEffect(() => {
		if (mapReady) {
			sendMessageToWebView({
				type: headingAvailable
					? 'headingAvailable'
					: 'headingUnavailable',
			});
		}
	}, [mapReady, headingAvailable, sendMessageToWebView]);

	// Шлём heading (направление компаса) в WebView
	useEffect(() => {
		if (mapReady && heading !== null) {
			sendMessageToWebView({
				type: 'updateHeading',
				payload: { heading },
			});
		}
	}, [mapReady, heading, sendMessageToWebView]);

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

	useEffect(() => {
		if (!mapReady || !location || hasCenteredOnUserRef.current) return;

		sendMessageToWebView({
			type: 'centerOnUser',
			payload: {
				coordinates: [location.longitude, location.latitude],
			},
		});
		hasCenteredOnUserRef.current = true;
	}, [mapReady, location, sendMessageToWebView]);

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

	const { showMarkerActionMenu, clearAllMarkers } = useMarkerActions({
		sendMessageToWebView,
		setPlacedMarkers,
	});

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

		console.log('[useMapBridge] send bootstrap payload');
		sendMessageToWebView({ type: 'bootstrapMap', payload });
		hasSentBootstrapRef.current = true;
	}, [isWebViewLoaded, isBootstrapReady, sendMessageToWebView]);

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

	const { followMode, setFollowMode, cycleFollowMode } = useFollowMode({
		mapReady,
		location,
		sendMessageToWebView,
		updateBootstrapFollowPreference,
	});

	const handleWebViewMessage = useWebViewMessageHandler({
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
	});

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

	const handleWebViewLoadStart = useCallback(() => {
		setIsWebViewLoaded(false);
		hasSentBootstrapRef.current = false;
		hasCenteredOnUserRef.current = false;
	}, []);

	const handleWebViewLoadEnd = useCallback(() => {
		setIsWebViewLoaded(true);
	}, []);

	const clearRoute = useCallback(() => {
		if (!mapReady) return;
		console.log('[useMapBridge] clearRoute');
		sendMessageToWebView({ type: 'clearRoute' });
	}, [mapReady, sendMessageToWebView]);

	const drawRoute = useCallback(
		(coordinates: [number, number][]) => {
			if (!mapReady) return;
			console.log('[useMapBridge] drawRoute', coordinates);
			sendMessageToWebView({
				type: 'drawRoute',
				payload: { coordinates },
			});
		},
		[mapReady, sendMessageToWebView],
	);

	const setMapLocation = useCallback(
		(center: [number, number], zoom = 14) => {
			if (!mapReady) return;
			console.log('[useMapBridge] setMapLocation', { center, zoom });
			sendMessageToWebView({
				type: 'setMapLocation',
				payload: { center, zoom },
			});
		},
		[mapReady, sendMessageToWebView],
	);

	const setMarkers = useCallback(
		(markers: PlacedMarkerData[], replace = false) => {
			console.log('[useMapBridge] setMarkers', {
				replace,
				count: markers.length,
				markers,
				mapReady,
			});

			setPlacedMarkers(prev =>
				replace ? markers : [...prev, ...markers],
			);

			if (!mapReady) {
				console.log(
					'[useMapBridge] map not ready; markers cached only',
				);
				return;
			}

			markers.forEach(marker => {
				console.log('[useMapBridge] send addMarker', marker);
				sendMessageToWebView({
					type: 'addMarker',
					payload: marker,
				});
			});
		},
		[mapReady, sendMessageToWebView, setPlacedMarkers],
	);

	const handleSearchResultSelect = useCallback(
		(coordinates: [number, number], addressText: string) => {
			if (mapReady) {
				console.log('[useMapBridge] handleSearchResultSelect', {
					coordinates,
					addressText,
				});
				const marker = {
					id: `search-${uuidv4()}`,
					coordinates,
					title: addressText,
				};
				setMapLocation(coordinates, 16);
				setMarkers([marker], true);
			}
		},
		[mapReady, setMarkers, setMapLocation],
	);

	const userLocation = location
		? { lat: location.latitude, lon: location.longitude }
		: null;

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
		drawRoute,
		clearRoute,
		setMapLocation,
		setMarkers,
		userLocation,
	} as const;
}
