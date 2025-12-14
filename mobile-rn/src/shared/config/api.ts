const DEFAULT_API_BASE_URL = 'http://92.246.141.61:8081';
const DEFAULT_ROUTES_API_BASE_URL = 'http://185.246.222.56:8082';

export const EXPO_PUBLIC_API_BASE_URL =
	process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;

export const API_BASE_URL = EXPO_PUBLIC_API_BASE_URL.replace(/\/$/, '');

// Routes API (AI генерация маршрутов)
export const EXPO_PUBLIC_ROUTES_API_BASE_URL =
	process.env.EXPO_PUBLIC_ROUTES_API_BASE_URL || DEFAULT_ROUTES_API_BASE_URL;

export const ROUTES_API_BASE_URL = EXPO_PUBLIC_ROUTES_API_BASE_URL.replace(
	/\/$/,
	'',
);

// 2GIS API ключ для геокодирования
export const EXPO_PUBLIC_2GIS_API_KEY =
	process.env.EXPO_PUBLIC_2GIS_API_KEY || '';
if (!EXPO_PUBLIC_2GIS_API_KEY) {
	throw new Error(
		'EXPO_PUBLIC_2GIS_API_KEY environment variable is not set.',
	);
}
