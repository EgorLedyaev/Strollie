/**
 * Centralized resolution of WebView base URL.
 * Priority:
 * 1. Explicit EXPO_PUBLIC_WEBVIEW_URL from env (any build)
 * 2. Fallback production constant
 *
 * In dev you can override by creating `.env.local` with EXPO_PUBLIC_WEBVIEW_URL=http://<lan-ip>:3000
 * `.env.production` always contains the production URL committed to VCS.
 */

const PROD_FALLBACK = 'http://185.246.222.56';

const PRIVATE_IP_REGEX = /^(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)/;

export interface WebviewUrlResolution {
	url: string;
	isFallback: boolean;
	isLocal: boolean;
	warning?: string;
}

function normalize(raw: string): string {
	if (!raw) return raw;
	return raw.startsWith('http://') || raw.startsWith('https://')
		? raw
		: `http://${raw}`;
}

export function resolveWebviewUrl(): WebviewUrlResolution {
	const raw = process.env.EXPO_PUBLIC_WEBVIEW_URL?.trim();
	const chosen = raw && raw.length > 0 ? raw : PROD_FALLBACK;
	const normalized = normalize(chosen);
	const isLocal = PRIVATE_IP_REGEX.test(
		normalized.replace('http://', '').replace('https://', ''),
	);
	let warning: string | undefined;

	if (!raw) {
		// No explicit env -> using fallback
		warning = 'EXPO_PUBLIC_WEBVIEW_URL not set, using production fallback';
	} else if (!__DEV__ && isLocal) {
		// Release build accidentally points to private IP
		warning =
			'Release build is pointing to a private/local IP. Check your CI env override.';
	}

	return {
		url: normalized,
		isFallback: !raw,
		isLocal,
		warning,
	};
}

export function getWebviewUrl(): string {
	const { url, warning } = resolveWebviewUrl();
	if (warning) console.warn('[webview-url]', warning, '->', url);
	return url;
}
