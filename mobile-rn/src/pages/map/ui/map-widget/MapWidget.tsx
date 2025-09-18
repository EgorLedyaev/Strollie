import { useAtom } from 'jotai';
import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

import { mapErrorAtom, mapReadyAtom } from '@/entities/map';
import { Colors } from '@/shared/tokens';
import { AppText, MapStatusIndicator } from '@/shared/ui';

interface MapWidgetProps {
	onMessage: (event: { nativeEvent: { data: string } }) => void;
}

export const MapWidget = forwardRef<WebView, MapWidgetProps>(
	({ onMessage }, ref) => {
		const [mapReady] = useAtom(mapReadyAtom);
		const [mapError, setMapError] = useAtom(mapErrorAtom);

		const webviewUrl = process.env.EXPO_PUBLIC_WEBVIEW_URL;
		if (!webviewUrl) {
			return (
				<View style={styles.errorView}>
					<AppText style={styles.errorText}>
						URL для WebView не настроен
					</AppText>
				</View>
			);
		}
		const uri = webviewUrl.startsWith('http')
			? webviewUrl
			: `http://${webviewUrl}`;

		return (
			<View style={styles.container}>
				<WebView
					ref={ref}
					source={{ uri }}
					style={styles.webview}
					onMessage={onMessage}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					originWhitelist={['*']}
					onError={e =>
						setMapError(
							`WebView Load Error: ${e.nativeEvent.description}`,
						)
					}
					injectedJavaScriptBeforeContentLoaded={`
                    window.onerror = function(message, source, lineno, colno, error) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'jsError', payload: { message: message }}));
                        return true;
                    };
                    true;
                `}
				/>
				<MapStatusIndicator mapReady={mapReady} mapError={mapError} />
			</View>
		);
	},
);

const styles = StyleSheet.create({
	container: { flex: 1 },
	errorText: { color: Colors.error },
	errorView: { alignItems: 'center', flex: 1, justifyContent: 'center' },
	webview: { flex: 1 },
	webviewLoading: { height: 0, opacity: 0, position: 'absolute', width: 0 },
});
