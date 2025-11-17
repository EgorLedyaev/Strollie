import apiClient from './client';

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

export const requestOneTimeCode = async (email: string) => {
	const { data } = await apiClient.post<RequestCodeResponse>(
		'/auth/request-code',
		{ email },
	);
	return data;
};

export const verifyOneTimeCode = async (params: {
	email: string;
	code: string;
}) => {
	const { data } = await apiClient.post<VerifyCodeResponse>(
		'/auth/verify-code',
		params,
	);
	return data;
};

export const refreshAccessToken = async (refreshToken: string) => {
	const { data } = await apiClient.post<RefreshResponse>('/auth/refresh', {
		refresh_token: refreshToken,
	});
	return data;
};

export const revokeRefreshToken = async (refreshToken: string) => {
	const { data } = await apiClient.post<LogoutResponse>('/auth/logout', {
		refresh_token: refreshToken,
	});
	return data;
};
