import { MapStatusIndicator } from '@/src/shared/ui/MapStatusIndicator/MapStatusIndicator';
import { useAtom, useSetAtom } from 'jotai';
import React, { forwardRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import WebView from 'react-native-webview';
import { mapErrorAtom, mapReadyAtom } from '@/src/entities/map/model/map-store';

interface MapWidgetProps {
    onMessage: (event: any) => void;
}

export const MapWidget = forwardRef<WebView, MapWidgetProps>(({ onMessage }, ref) => {
    const [mapReady] = useAtom(mapReadyAtom);
    const [mapError, setMapError] = useAtom(mapErrorAtom);

    const webviewUrl = process.env.EXPO_PUBLIC_WEBVIEW_URL;
    if (!webviewUrl) {
        return <View style={styles.errorView}><Text style={styles.errorText}>URL для WebView не настроен</Text></View>;
    }
    const uri = webviewUrl.startsWith('http') ? webviewUrl : `http://${webviewUrl}`;

    return (
        <View style={styles.container}>
            <WebView
                ref={ref}
                source={{ uri }}
                style={mapReady ? styles.webview : styles.webviewLoading}
                onMessage={onMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                originWhitelist={['*']}
                onError={(e) => setMapError(`WebView Load Error: ${e.nativeEvent.description}`)}
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
});

const styles = StyleSheet.create({
    container: { flex: 1 },
    webview: { flex: 1, opacity: 1 },
    webviewLoading: { position: 'absolute', width: 0, height: 0, opacity: 0 },
    errorView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'red' },
});
