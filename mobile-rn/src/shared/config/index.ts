// Публичный API сегмента config
export { EXPO_PUBLIC_2GIS_API_KEY, API_BASE_URL } from './api';
export { SESSION_STORAGE_KEY, USER_PROFILE_STORAGE_KEY } from './storageKeys';
export {
	USE_MOCK_AUTH,
	USE_MOCK_UPLOAD_AVATAR,
	MOCK_UPLOAD_AVATAR_MODE,
	MOCK_CDN_BASE,
	type MockUploadMode,
} from './feature-flags';
export { OTP_CODE_LENGTH } from './auth';
export {
	ANALYTICS_ENABLED,
	ANALYTICS_DEBUG,
	ANALYTICS_INCLUDE_CONTEXT,
	APPMETRICA_API_KEY,
} from './analytics';
