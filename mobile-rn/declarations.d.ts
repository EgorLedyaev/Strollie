// declarations.d.ts
declare module '*.png' {
	const value: never;
	export default value;
}
declare module '*.ttf' {
	const value: never;
	export default value;
}

declare module '*.html' {
	const content: string;
	export default content;
}

declare module '*.otf' {
	const value: never;
	export default value;
}

declare module 'react-native-appmetrica-next' {
	interface AppMetricaConfig {
		apiKey: string;
		appVersion?: string;
		logs?: boolean;
		sessionTimeout?: number;
		firstActivationAsUpdate?: boolean;
	}

	interface AppMetricaSDK {
		activate(config: AppMetricaConfig): void;
		reportEvent(eventName: string, params?: Record<string, unknown>): void;
		setUserProfileID(userProfileId: string | null): void;
		sendEventsBuffer(): void;
	}

	const AppMetrica: AppMetricaSDK;
	export default AppMetrica;
}
