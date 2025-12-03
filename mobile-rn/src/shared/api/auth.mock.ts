import type {
	LogoutResponse,
	RefreshResponse,
	RequestCodeResponse,
	VerifyCodeResponse,
} from './auth.service';

/**
 * Dev-mode OTP code. Use "1234" to authenticate in dev mode.
 */
export const DEV_OTP_CODE = '1234';

/**
 * Generate a dev access token with timestamp for uniqueness.
 */
const generateDevAccessToken = (): string => {
	const timestamp = Date.now();
	return `dev-access-${timestamp}-${Math.random().toString(36).slice(2, 10)}`;
};

/**
 * Generate a dev refresh token with timestamp for uniqueness.
 */
const generateDevRefreshToken = (): string => {
	const timestamp = Date.now();
	return `dev-refresh-${timestamp}-${Math.random().toString(36).slice(2, 10)}`;
};

/**
 * Simulate network delay for realistic dev experience.
 */
const simulateDelay = (ms: number = 500): Promise<void> =>
	new Promise(resolve => setTimeout(resolve, ms));

/**
 * [MOCK] Request one-time code.
 * Always succeeds in dev mode, simulating email send.
 */
export const requestOneTimeCodeMock = async (
	email: string,
): Promise<RequestCodeResponse> => {
	await simulateDelay(300);

	console.log(
		`[DEV AUTH] OTP code sent to ${email}. Use code: ${DEV_OTP_CODE}`,
	);

	return {
		status: 'ok',
		to: email,
	};
};

/**
 * [MOCK] Verify one-time code.
 * Accepts only DEV_OTP_CODE ("1234") in dev mode.
 */
export const verifyOneTimeCodeMock = async (params: {
	email: string;
	code: string;
}): Promise<VerifyCodeResponse> => {
	await simulateDelay(400);

	if (params.code !== DEV_OTP_CODE) {
		throw new Error(
			`Неверный код. В dev-режиме используйте: ${DEV_OTP_CODE}`,
		);
	}

	console.log(`[DEV AUTH] User ${params.email} authenticated successfully`);

	return {
		access_token: generateDevAccessToken(),
		refresh_token: generateDevRefreshToken(),
		token_type: 'Bearer',
	};
};

/**
 * [MOCK] Refresh access token.
 * Always succeeds in dev mode with new tokens.
 */
export const refreshAccessTokenMock = async (
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	refreshToken: string,
): Promise<RefreshResponse> => {
	await simulateDelay(200);

	console.log('[DEV AUTH] Token refreshed');

	return {
		access_token: generateDevAccessToken(),
		token_type: 'Bearer',
	};
};

/**
 * [MOCK] Revoke refresh token (logout).
 * Always succeeds in dev mode.
 */
export const revokeRefreshTokenMock = async (
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	refreshToken: string,
): Promise<LogoutResponse> => {
	await simulateDelay(100);

	console.log('[DEV AUTH] User logged out');

	return {
		status: 'ok',
	};
};
