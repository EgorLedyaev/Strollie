export interface BaseAnalyticsEventMap {
	'app.launch': {
		source?: 'cold' | 'background' | 'notification';
		trigger?: string;
	};
	'user.session': {
		state: 'login' | 'logout' | 'refresh';
		method?: 'password' | 'otp' | 'oauth' | 'silent' | 'logout';
		userId: string | null;
	};
}

declare global {
	// Позволяет слайсам расширять карту событий с помощью declaration merging.
	interface StrollieAnalyticsEventMap {
		__never__?: never;
	}
}

type ExtendedAnalyticsEventMap = BaseAnalyticsEventMap &
	StrollieAnalyticsEventMap;

export type AnalyticsEventMap = Omit<ExtendedAnalyticsEventMap, '__never__'>;

export type AnalyticsEventName = keyof AnalyticsEventMap;

export type AnalyticsEventPayload<Name extends AnalyticsEventName> =
	AnalyticsEventMap[Name];

export interface AnalyticsEventContext {
	appVersion?: string;
	deviceId?: string;
	platform?: string;
	userId?: string | null;
	sessionId?: string;
	timestamp?: number;
	[key: string]: unknown;
}

export interface AnalyticsInitOptions {
	appVersion?: string;
	deviceId?: string;
	platform?: string;
	enabled?: boolean;
	debug?: boolean;
}

export interface AnalyticsTransport {
	readonly name: string;
	init?(options: AnalyticsInitOptions): Promise<void> | void;
	setUser?(userId: string | null): Promise<void> | void;
	trackEvent<Name extends AnalyticsEventName>(
		event: Name,
		payload: AnalyticsEventPayload<Name>,
		context: AnalyticsEventContext,
	): Promise<void> | void;
	flush?(): Promise<void> | void;
	dispose?(): Promise<void> | void;
}
