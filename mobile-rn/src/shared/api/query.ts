import apiClient, { HttpError, type HttpRequestConfig } from './client';

interface AppErrorOptions {
	status?: number;
	data?: unknown;
	cause?: unknown;
}

export class AppError extends Error {
	status?: number;
	data?: unknown;

	constructor(message: string, options?: AppErrorOptions) {
		super(message, { cause: options?.cause });
		this.name = 'AppError';
		this.status = options?.status;
		this.data = options?.data;
	}
}

export const createQueryFn =
	<TData>(requestFactory: () => HttpRequestConfig) =>
	async (): Promise<TData> => {
		try {
			const config = requestFactory();
			const { data } = await apiClient.request<TData>(config);
			return data;
		} catch (error) {
			if (error instanceof HttpError) {
				throw new AppError(error.message, {
					status: error.status,
					data: error.data,
					cause: error,
				});
			}
			throw error;
		}
	};

export const createMutationFn =
	<TData, TVariables = void>(
		requestFactory: (variables: TVariables) => HttpRequestConfig,
	) =>
	async (variables: TVariables): Promise<TData> => {
		try {
			const config = requestFactory(variables);
			const { data } = await apiClient.request<TData>(config);
			return data;
		} catch (error) {
			if (error instanceof HttpError) {
				throw new AppError(error.message, {
					status: error.status,
					data: error.data,
					cause: error,
				});
			}
			throw error;
		}
	};
