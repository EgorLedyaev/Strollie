import axios, {
	AxiosError,
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from 'axios';

import { API_BASE_URL } from '@/shared/config/api';

/**
 * Axios instance with pre-configured baseURL, timeout, and default headers.
 * Interceptors for auth and 401 handling are added separately via `setupAuthInterceptors`.
 */
export const axiosClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
	},
});

/**
 * Error class for API errors with additional context.
 */
export class ApiError extends Error {
	status?: number;
	data?: unknown;
	isNetworkError: boolean;
	isTimeout: boolean;

	constructor(
		message: string,
		options?: {
			status?: number;
			data?: unknown;
			cause?: unknown;
			isNetworkError?: boolean;
			isTimeout?: boolean;
		},
	) {
		super(message, { cause: options?.cause });
		this.name = 'ApiError';
		this.status = options?.status;
		this.data = options?.data;
		this.isNetworkError = options?.isNetworkError ?? false;
		this.isTimeout = options?.isTimeout ?? false;
	}

	static fromAxiosError(error: AxiosError): ApiError {
		if (
			error.code === 'ECONNABORTED' ||
			error.message.includes('timeout')
		) {
			return new ApiError('Request timeout', {
				cause: error,
				isTimeout: true,
			});
		}

		if (!error.response) {
			return new ApiError('Network error', {
				cause: error,
				isNetworkError: true,
			});
		}

		return new ApiError(error.message || 'Request failed', {
			status: error.response.status,
			data: error.response.data,
			cause: error,
		});
	}
}

/**
 * Token getter function type - will be injected from session module.
 */
type TokenGetter = () => string | null;
type TokenRefresher = () => Promise<boolean>;
type LogoutHandler = () => void;

let getAccessToken: TokenGetter = () => null;
let getTokenType: () => string = () => 'Bearer';
let refreshToken: TokenRefresher = async () => false;
let handleLogout: LogoutHandler = () => {};

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
// Queue of requests waiting for token refresh
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
	refreshSubscribers.push(callback);
};

const onTokenRefreshed = (newToken: string) => {
	refreshSubscribers.forEach(callback => callback(newToken));
	refreshSubscribers = [];
};

/**
 * Setup auth interceptors. Call this once from app initialization.
 */
export const setupAuthInterceptors = (config: {
	getAccessToken: TokenGetter;
	getTokenType?: () => string;
	refreshToken: TokenRefresher;
	onLogout: LogoutHandler;
}) => {
	getAccessToken = config.getAccessToken;
	getTokenType = config.getTokenType ?? (() => 'Bearer');
	refreshToken = config.refreshToken;
	handleLogout = config.onLogout;
};

// Request interceptor: add Authorization header
axiosClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = getAccessToken();
		if (token && config.headers) {
			const tokenType = getTokenType();
			config.headers.Authorization = `${tokenType} ${token}`;
		}
		return config;
	},
	error => Promise.reject(error),
);

// Response interceptor: handle 401 and refresh token
axiosClient.interceptors.response.use(
	response => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		// Only handle 401 errors
		if (error.response?.status !== 401 || !originalRequest) {
			return Promise.reject(ApiError.fromAxiosError(error));
		}

		// Prevent infinite loop
		if (originalRequest._retry) {
			handleLogout();
			return Promise.reject(ApiError.fromAxiosError(error));
		}

		// If already refreshing, queue this request
		if (isRefreshing) {
			return new Promise(resolve => {
				subscribeTokenRefresh((newToken: string) => {
					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `${getTokenType()} ${newToken}`;
					}
					resolve(axiosClient(originalRequest));
				});
			});
		}

		originalRequest._retry = true;
		isRefreshing = true;

		try {
			const success = await refreshToken();
			if (success) {
				const newToken = getAccessToken();
				if (newToken) {
					onTokenRefreshed(newToken);
					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `${getTokenType()} ${newToken}`;
					}
					return axiosClient(originalRequest);
				}
			}
			// Refresh failed
			handleLogout();
			return Promise.reject(ApiError.fromAxiosError(error));
		} catch {
			handleLogout();
			return Promise.reject(ApiError.fromAxiosError(error));
		} finally {
			isRefreshing = false;
		}
	},
);

export default axiosClient;
