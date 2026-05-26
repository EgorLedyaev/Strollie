import axios, { AxiosError, type AxiosInstance } from 'axios';

import { ROUTES_API_BASE_URL } from '@/shared/config/api';

import { ApiError } from './axios-client';

/**
 * Timeout для генерации маршрута (30 секунд).
 * AI-генерация занимает значительное время.
 */
const ROUTES_API_TIMEOUT = 30000;

/**
 * Axios instance для Routes API (генерация маршрутов).
 * Отдельный от основного API:
 * - Другой baseURL
 * - Увеличенный timeout (30s)
 * - Без auth interceptors (публичный API)
 */
export const routesAxiosClient: AxiosInstance = axios.create({
	baseURL: ROUTES_API_BASE_URL,
	timeout: ROUTES_API_TIMEOUT,
	headers: {
		'Content-Type': 'application/json',
	},
});

/**
 * Response interceptor для преобразования ошибок.
 */
routesAxiosClient.interceptors.response.use(
	response => response,
	(error: AxiosError) => {
		throw ApiError.fromAxiosError(error);
	},
);
