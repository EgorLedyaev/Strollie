import { useAtom } from 'jotai';
import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';

import { getWebviewUrl } from '@/shared/lib';
import { Colors } from '@/shared/tokens';
import { AppText, MapStatusIndicator } from '@/shared/ui';

import { mapErrorAtom, mapReadyAtom } from '../../model/map-store';

interface MapWidgetProps {
	onMessage: (event: { nativeEvent: { data: string } }) => void;
	onLoadStart?: () => void;
	onLoadEnd?: () => void;
	injectedBootstrapScript?: string;
}

export const MapWidget = forwardRef<WebView, MapWidgetProps>(
	({ onMessage, onLoadStart, onLoadEnd, injectedBootstrapScript }, ref) => {
		const [mapReady] = useAtom(mapReadyAtom);
		const [mapError, setMapError] = useAtom(mapErrorAtom);

		const webviewUrl = getWebviewUrl();
		if (!webviewUrl) {
			return (
				<View style={styles.errorView}>
					<AppText style={styles.errorText}>
						URL для WebView не настроен
					</AppText>
				</View>
			);
		}
		const uri = webviewUrl; // helper уже нормализует

		const hasBootstrapScript = Boolean(injectedBootstrapScript);
		const beforeContentScript = injectedBootstrapScript
			? `${injectedBootstrapScript}
window.onerror = function(message, source, lineno, colno, error) {
	window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'jsError', payload: { message: message }}));
	return true;
};
true;`
			: undefined;

		return (
			<View style={styles.container}>
				{hasBootstrapScript ? (
					<WebView
						ref={ref}
						source={{ uri }}
						style={styles.webview}
						onMessage={onMessage}
						onLoadStart={onLoadStart}
						onLoadEnd={onLoadEnd}
						javaScriptEnabled={true}
						domStorageEnabled={true}
						originWhitelist={['*']}
						onError={(event: WebViewErrorEvent) => {
							setMapError(
								`WebView Load Error: ${event.nativeEvent.description}`,
							);
						}}
						injectedJavaScriptBeforeContentLoaded={
							beforeContentScript
						}
					/>
				) : (
					<View style={styles.placeholder}>
						<AppText style={styles.placeholderText}>
							Загрузка карты...
						</AppText>
					</View>
				)}
				<MapStatusIndicator mapReady={mapReady} mapError={mapError} />
			</View>
		);
	},
);

const styles = StyleSheet.create({
	container: { flex: 1 },
	errorText: { color: Colors.error },
	errorView: { alignItems: 'center', flex: 1, justifyContent: 'center' },
	placeholder: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
	placeholderText: {
		color: Colors.secondaryText,
	},
	webview: { flex: 1 },
	webviewLoading: { height: 0, opacity: 0, position: 'absolute', width: 0 },
});
