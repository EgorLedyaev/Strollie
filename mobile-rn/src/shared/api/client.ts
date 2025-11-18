import { API_BASE_URL } from '@/shared/config/api';

type SearchParamsValue = string | number | boolean | null | undefined;

export interface HttpRequestConfig {
	url: string;
	method?: string;
	params?: Record<string, SearchParamsValue | Array<SearchParamsValue>>;
	data?: unknown;
	headers?: Record<string, string | undefined>;
	timeout?: number;
	signal?: AbortSignal;
}

export interface ApiClientOptions {
	baseURL?: string;
	timeout?: number;
	headers?: Record<string, string>;
}

export class HttpError extends Error {
	status?: number;
	data?: unknown;

	constructor(
		message: string,
		options?: { status?: number; data?: unknown; cause?: unknown },
	) {
		super(message, { cause: options?.cause });
		this.name = 'HttpError';
		this.status = options?.status;
		this.data = options?.data;
	}
}

const buildSearchParams = (
	params?: Record<string, SearchParamsValue | Array<SearchParamsValue>>,
) => {
	if (!params) {
		return '';
	}
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value === undefined || value === null) {
			return;
		}
		if (Array.isArray(value)) {
			value.forEach(item => {
				if (item !== undefined && item !== null) {
					searchParams.append(key, String(item));
				}
			});
			return;
		}
		searchParams.append(key, String(value));
	});
	const query = searchParams.toString();
	return query ? `?${query}` : '';
};

const isFormData = (payload: unknown): payload is FormData =>
	typeof FormData !== 'undefined' && payload instanceof FormData;

export class ApiClient {
	private readonly baseURL: string;
	private readonly timeout: number;
	defaultHeaders: Record<string, string>;
	readonly defaults: { headers: { common: Record<string, string> } };

	constructor(options: ApiClientOptions = {}) {
		this.baseURL = options.baseURL ?? API_BASE_URL;
		this.timeout = options.timeout ?? 15000;
		this.defaultHeaders = {
			'Content-Type': 'application/json',
			...options.headers,
		};
		this.defaults = {
			headers: {
				common: this.defaultHeaders,
			},
		};
	}

	private resolveUrl(path: string, params?: HttpRequestConfig['params']) {
		const base = path.startsWith('http') ? path : `${this.baseURL}${path}`;
		return `${base}${buildSearchParams(params)}`;
	}

	private resolveBody(data: unknown, headers: Record<string, string>) {
		if (data === undefined || data === null) {
			return undefined;
		}
		if (isFormData(data)) {
			delete headers['Content-Type'];
			// Для FormData заголовок Content-Type выставляется автоматически
			return data;
		}
		if (typeof data === 'string') {
			return data;
		}
		return JSON.stringify(data, (_, value) =>
			value === undefined ? null : value,
		);
	}

	private async parseResponse<T>(response: Response): Promise<T> {
		const contentType = response.headers.get('Content-Type');
		const raw = await response.text();
		if (!raw) {
			return undefined as T;
		}
		if (contentType?.includes('application/json')) {
			try {
				return JSON.parse(raw) as T;
			} catch (error) {
				console.warn('Failed to parse JSON response', error);
			}
		}
		return raw as unknown as T;
	}

	async request<T>(config: HttpRequestConfig): Promise<{ data: T }> {
		const {
			url,
			method = 'GET',
			data,
			headers,
			timeout,
			params,
			signal,
		} = config;
		const resolvedUrl = this.resolveUrl(url, params);
		const mergedHeaders = Object.entries({
			...this.defaults.headers.common,
			...headers,
		}).reduce<Record<string, string>>((acc, [key, value]) => {
			if (value !== undefined) {
				acc[key] = value;
			}
			return acc;
		}, {});
		const controller = new AbortController();
		const timeoutMs = timeout ?? this.timeout;
		const timeoutId = timeoutMs
			? setTimeout(() => {
					controller.abort();
				}, timeoutMs)
			: undefined;
		const body = this.resolveBody(data, mergedHeaders);
		const requestInit: RequestInit = {
			method,
			headers: mergedHeaders,
			body,
			signal: signal ?? controller.signal,
		};

		console.log(`Запрос: ${method.toUpperCase()} ${resolvedUrl}`);
		try {
			const response = await fetch(resolvedUrl, requestInit);
			const payload = await this.parseResponse<T>(response);
			console.log(`Ответ: ${response.status} от ${resolvedUrl}`);
			if (!response.ok) {
				throw new HttpError('Request failed', {
					status: response.status,
					data: payload,
				});
			}
			return { data: payload };
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') {
				throw new HttpError('Request aborted', { cause: error });
			}
			if (error instanceof HttpError) {
				throw error;
			}
			throw new HttpError('Network error', { cause: error });
		} finally {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		}
	}

	get<T>(
		url: string,
		config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
	) {
		return this.request<T>({ ...config, url, method: 'GET' });
	}

	delete<T>(
		url: string,
		config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
	) {
		return this.request<T>({ ...config, url, method: 'DELETE' });
	}

	post<T>(
		url: string,
		data?: unknown,
		config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
	) {
		return this.request<T>({ ...config, url, method: 'POST', data });
	}

	put<T>(
		url: string,
		data?: unknown,
		config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
	) {
		return this.request<T>({ ...config, url, method: 'PUT', data });
	}

	patch<T>(
		url: string,
		data?: unknown,
		config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
	) {
		return this.request<T>({ ...config, url, method: 'PATCH', data });
	}
}

const apiClient = new ApiClient();

export default apiClient;
