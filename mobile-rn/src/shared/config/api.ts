// 2GIS API ключ для геокодирования
export const EXPO_PUBLIC_2GIS_API_KEY =
	process.env.EXPO_PUBLIC_2GIS_API_KEY || '';
if (!EXPO_PUBLIC_2GIS_API_KEY) {
	throw new Error(
		'EXPO_PUBLIC_2GIS_API_KEY environment variable is not set.',
	);
}
