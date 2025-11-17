// apiClient.ts
import axios, {
	AxiosError,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios';

import { API_BASE_URL } from '@/shared/config/api';

// Базовый экземпляр
const apiClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Интерцепторы запросов
apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
		console.log(`Запрос: ${config.method?.toUpperCase()} ${config.url}`);
		return config;
	},
	(error: AxiosError): Promise<AxiosError> => {
		console.error('Ошибка в конфигурации запроса:', error.message);
		return Promise.reject(error);
	},
);

// Интерцепторы ответов
apiClient.interceptors.response.use(
	(response: AxiosResponse): AxiosResponse => {
		console.log(`Ответ: ${response.status} от ${response.config.url}`);
		return response;
	},
	(error: AxiosError): Promise<AxiosError> => {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				console.error(
					`Ошибка ${error.response.status}: ${error.message}`,
				);
			} else if (error.request) {
				console.error(`Нет ответа от сервера: ${error.message}`);
			} else {
				console.error(`Ошибка запроса: ${error.message}`);
			}
		}
		return Promise.reject(error);
	},
);

export default apiClient;
