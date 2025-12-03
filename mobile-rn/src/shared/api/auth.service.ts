import { USE_MOCK_AUTH } from '@/shared/config';

import {
	refreshAccessTokenMock,
	requestOneTimeCodeMock,
	revokeRefreshTokenMock,
	verifyOneTimeCodeMock,
} from './auth.mock';
import axiosClient from './axios-client';

export interface RequestCodeResponse {
	status: string;
	to: string;
}

export interface VerifyCodeResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
}

export interface RefreshResponse {
	access_token: string;
	token_type: string;
}

export interface LogoutResponse {
	status: string;
}

// Real API implementations
const requestOneTimeCodeReal = async (
	email: string,
): Promise<RequestCodeResponse> => {
	const { data } = await axiosClient.post<RequestCodeResponse>(
		'/auth/request-code',
		{ email },
	);
	return data;
};

const verifyOneTimeCodeReal = async (params: {
	email: string;
	code: string;
}): Promise<VerifyCodeResponse> => {
	const { data } = await axiosClient.post<VerifyCodeResponse>(
		'/auth/verify-code',
		params,
	);
	return data;
};

const refreshAccessTokenReal = async (
	refreshToken: string,
): Promise<RefreshResponse> => {
	const { data } = await axiosClient.post<RefreshResponse>('/auth/refresh', {
		refresh_token: refreshToken,
	});
	return data;
};

const revokeRefreshTokenReal = async (
	refreshToken: string,
): Promise<LogoutResponse> => {
	const { data } = await axiosClient.post<LogoutResponse>('/auth/logout', {
		refresh_token: refreshToken,
	});
	return data;
};

// Conditional exports based on USE_MOCK_AUTH flag
export const requestOneTimeCode = USE_MOCK_AUTH
	? requestOneTimeCodeMock
	: requestOneTimeCodeReal;

export const verifyOneTimeCode = USE_MOCK_AUTH
	? verifyOneTimeCodeMock
	: verifyOneTimeCodeReal;

export const refreshAccessToken = USE_MOCK_AUTH
	? refreshAccessTokenMock
	: refreshAccessTokenReal;

export const revokeRefreshToken = USE_MOCK_AUTH
	? revokeRefreshTokenMock
	: revokeRefreshTokenReal;
