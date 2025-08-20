import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';

import { useMapBridge } from '@/features/map-bridge';

import { MapControls } from './map-controls';
import { MapWidget } from './map-widget';
import { SHADOW_PADDING, WeatherWidget } from './map-widget/WeatherWidget';

export function MapPage() {
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
		// Новый стабильный флаг для UI
		uiIs3DMode,
		uiFollowMode,
	} = useMapBridge();

	const rightForWeatherWidget = { right: 16 - SHADOW_PADDING };
	const temperature = 16;

	return (
		<>
			<SystemBars style='dark' />
			<MapWidget ref={webViewRef} onMessage={handleWebViewMessage} />
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
		</>
	);
}

const styles = StyleSheet.create({
	weatherContainer: {
		position: 'absolute',
		top: Platform.OS === 'ios' ? 120 : 100,
	},
});
