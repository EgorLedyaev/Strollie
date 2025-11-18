import { Platform } from 'react-native';
import AppMetrica from 'react-native-appmetrica-next';

import type {
	AnalyticsEventContext,
	AnalyticsEventMap,
	AnalyticsEventName,
	AnalyticsInitOptions,
	AnalyticsTransport,
} from '../types';

interface AppMetricaTransportOptions {
	apiKey: string;
	includeContext?: boolean;
	sessionTimeout?: number;
	logs?: boolean;
}

const isNativePlatform = Platform.OS === 'ios' || Platform.OS === 'android';

export const createAppMetricaTransport = (
	opts: AppMetricaTransportOptions,
): AnalyticsTransport | null => {
	if (!opts.apiKey) {
		return null;
	}

	let activated = false;

	const includeContext = opts.includeContext ?? true;

	const withContext = (
		payload: Record<string, unknown>,
		context: AnalyticsEventContext,
	): Record<string, unknown> => {
		if (!includeContext) {
			return payload;
		}

		return Object.keys(context).length
			? {
					...payload,
					__context: context,
				}
			: payload;
	};

	return {
		name: 'appmetrica',
		async init(options?: AnalyticsInitOptions) {
			if (!isNativePlatform || activated) {
				return;
			}

			if (options?.enabled === false) {
				if (__DEV__) {
					console.info('[analytics] Транспорт AppMetrica отключен.');
				}
				return;
			}

			try {
				AppMetrica.activate({
					apiKey: opts.apiKey,
					appVersion: options?.appVersion,
					logs: opts.logs ?? options?.debug ?? false,
					sessionTimeout: opts.sessionTimeout ?? 30,
				});
				activated = true;
			} catch (error) {
				console.warn(
					'[analytics][appmetrica] Не удалось инициализировать SDK',
					error,
				);
			}
		},
		async setUser(userId: string | null) {
			if (!activated || !isNativePlatform) {
				return;
			}
			AppMetrica.setUserProfileID(userId);
		},
		async trackEvent<Name extends AnalyticsEventName>(
			event: Name,
			payload: AnalyticsEventMap[Name],
			context: AnalyticsEventContext,
		) {
			if (!activated || !isNativePlatform) {
				return;
			}

			const safePayload = withContext({ ...payload }, context);
			AppMetrica.reportEvent(event, safePayload);
		},
		async flush() {
			if (!activated || !isNativePlatform) {
				return;
			}
			AppMetrica.sendEventsBuffer();
		},
	};
};
