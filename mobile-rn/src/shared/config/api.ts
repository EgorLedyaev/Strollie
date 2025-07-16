export const API_URL =
	process.env.EXPO_PUBLIC_API_URL || 'http://77.239.108.107:8080/api/v1';
export const API_PREFIX = '/api/v1';

// 2GIS API ключ для геокодирования
export const EXPO_PUBLIC_2GIS_API_KEY = process.env.EXPO_PUBLIC_2GIS_API_KEY || '';
if (!EXPO_PUBLIC_2GIS_API_KEY) {
	throw new Error('EXPO_PUBLIC_2GIS_API_KEY environment variable is not set.');
}
