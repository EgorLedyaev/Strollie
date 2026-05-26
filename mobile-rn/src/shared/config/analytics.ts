const parseBoolean = (value?: string | null, defaultValue = true) => {
	if (value === undefined || value === null || value === '') {
		return defaultValue;
	}
	return value.toLowerCase() !== 'false';
};

export const ANALYTICS_ENABLED = parseBoolean(
	process.env.EXPO_PUBLIC_ANALYTICS_ENABLED,
	true,
);

export const ANALYTICS_DEBUG = parseBoolean(
	process.env.EXPO_PUBLIC_ANALYTICS_DEBUG,
	false,
);

export const APPMETRICA_API_KEY =
	process.env.EXPO_PUBLIC_APPMETRICA_API_KEY ?? '';

export const ANALYTICS_INCLUDE_CONTEXT = parseBoolean(
	process.env.EXPO_PUBLIC_ANALYTICS_INCLUDE_CONTEXT,
	true,
);
