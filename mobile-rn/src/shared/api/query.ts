import { AxiosError, type AxiosRequestConfig } from 'axios';

import axiosClient, { ApiError } from './axios-client';

/**
 * Application-level error with status and data.
 * Used for React Query error handling.
 */
export class AppError extends Error {
	status?: number;
	data?: unknown;

	constructor(
		message: string,
		options?: { status?: number; data?: unknown; cause?: unknown },
	) {
		super(message, { cause: options?.cause });
		this.name = 'AppError';
		this.status = options?.status;
		this.data = options?.data;
	}

	static fromApiError(error: ApiError): AppError {
		return new AppError(error.message, {
			status: error.status,
			data: error.data,
			cause: error,
		});
	}
}

/**
 * Creates a query function for React Query from an axios request config factory.
 * @param requestFactory - Function that returns AxiosRequestConfig
 * @returns Query function that can be used in useQuery
 */
export const createQueryFn =
	<TData>(requestFactory: () => AxiosRequestConfig) =>
	async (): Promise<TData> => {
		try {
			const config = requestFactory();
			const { data } = await axiosClient.request<TData>(config);
			return data;
		} catch (error) {
			if (error instanceof ApiError) {
				throw AppError.fromApiError(error);
			}
			if (error instanceof AxiosError) {
				throw new AppError(error.message, {
					status: error.response?.status,
					data: error.response?.data,
					cause: error,
				});
			}
			throw error;
		}
	};

/**
 * Creates a mutation function for React Query from an axios request config factory.
 * @param requestFactory - Function that takes variables and returns AxiosRequestConfig
 * @returns Mutation function that can be used in useMutation
 */
export const createMutationFn =
	<TData, TVariables = void>(
		requestFactory: (variables: TVariables) => AxiosRequestConfig,
	) =>
	async (variables: TVariables): Promise<TData> => {
		try {
			const config = requestFactory(variables);
			const { data } = await axiosClient.request<TData>(config);
			return data;
		} catch (error) {
			if (error instanceof ApiError) {
				throw AppError.fromApiError(error);
			}
			if (error instanceof AxiosError) {
				throw new AppError(error.message, {
					status: error.response?.status,
					data: error.response?.data,
					cause: error,
				});
			}
			throw error;
		}
	};
