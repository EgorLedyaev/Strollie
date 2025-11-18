import { Platform } from 'react-native';

import type {
	AnalyticsEventContext,
	AnalyticsEventMap,
	AnalyticsEventName,
	AnalyticsInitOptions,
	AnalyticsTransport,
} from './types';

export class AnalyticsService {
	private transports = new Map<string, AnalyticsTransport>();

	private baseContext: AnalyticsEventContext = {
		platform: Platform.OS,
	};

	registerTransport(transport?: AnalyticsTransport | null) {
		if (!transport) {
			return;
		}
		if (this.transports.has(transport.name)) {
			return;
		}
		this.transports.set(transport.name, transport);
	}

	async init(options?: AnalyticsInitOptions) {
		if (options) {
			this.baseContext = {
				...this.baseContext,
				appVersion: options.appVersion ?? this.baseContext.appVersion,
				deviceId: options.deviceId ?? this.baseContext.deviceId,
				platform: options.platform ?? this.baseContext.platform,
			};
		}

		await Promise.allSettled(
			Array.from(this.transports.values()).map(transport =>
				transport.init
					? transport.init(options ?? {})
					: Promise.resolve(),
			),
		);
	}

	updateContext(context: Partial<AnalyticsEventContext>) {
		this.baseContext = {
			...this.baseContext,
			...context,
		};
	}

	async setUser(userId: string | null) {
		this.baseContext = {
			...this.baseContext,
			userId,
		};

		await Promise.allSettled(
			Array.from(this.transports.values()).map(transport =>
				transport.setUser
					? transport.setUser(userId)
					: Promise.resolve(),
			),
		);
	}

	async trackEvent<Name extends AnalyticsEventName>(
		event: Name,
		payload: AnalyticsEventMap[Name],
		extraContext?: Partial<AnalyticsEventContext>,
	) {
		if (!this.transports.size) {
			if (__DEV__) {
				console.warn(
					`[analytics] Попытка отправить событие "${event}", но не зарегистрировано ни одного транспорта`,
				);
			}
			return;
		}

		const context: AnalyticsEventContext = {
			...this.baseContext,
			...extraContext,
			timestamp: extraContext?.timestamp ?? Date.now(),
		};

		await Promise.allSettled(
			Array.from(this.transports.values()).map(transport =>
				transport.trackEvent(event, payload, context),
			),
		);
	}

	async flush() {
		await Promise.allSettled(
			Array.from(this.transports.values()).map(transport =>
				transport.flush ? transport.flush() : Promise.resolve(),
			),
		);
	}

	async dispose() {
		await Promise.allSettled(
			Array.from(this.transports.values()).map(transport =>
				transport.dispose ? transport.dispose() : Promise.resolve(),
			),
		);
		this.transports.clear();
	}
}

export const analytics = new AnalyticsService();
