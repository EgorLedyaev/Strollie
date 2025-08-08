// Feature flags for API/mock behavior
// Use EXPO_PUBLIC_* so they are available in the client bundle

export type MockUploadMode = 'local' | 'cdn';

// Enable/disable avatar upload mock. Default: true (until backend ready)
export const USE_MOCK_UPLOAD_AVATAR =
	(process.env.EXPO_PUBLIC_USE_MOCK_UPLOAD_AVATAR || 'true') === 'true';

// Mock behavior: 'local' returns the original local file URI for immediate preview,
// 'cdn' returns a fake CDN URL that looks like server output.
export const MOCK_UPLOAD_AVATAR_MODE: MockUploadMode =
	((process.env.EXPO_PUBLIC_MOCK_UPLOAD_AVATAR_MODE as MockUploadMode) ||
		'local');

// Base for fake CDN URLs when using MOCK_UPLOAD_AVATAR_MODE='cdn'
export const MOCK_CDN_BASE =
	process.env.EXPO_PUBLIC_MOCK_CDN_BASE || 'https://cdn.strollie.ru/avatars';
