import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { updateShouldCenterOnUser } from '@/shared/lib';

import type { FollowMode } from './types';

interface FollowModeParams {
	mapReady: boolean;
	location: { latitude: number; longitude: number } | null;
	sendMessageToWebView: (message: Record<string, unknown>) => void;
	updateBootstrapFollowPreference: (shouldCenter: boolean) => void;
}

export function useFollowMode({
	mapReady,
	location,
	sendMessageToWebView,
	updateBootstrapFollowPreference,
}: FollowModeParams) {
	const [followMode, setFollowMode] = useState<FollowMode>('none');

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

	return {
		followMode,
		setFollowMode,
		cycleFollowMode,
	};
}
