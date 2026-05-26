import { QueryClient, type DefaultOptions } from '@tanstack/react-query';

const baseDefaultOptions: DefaultOptions = {
	queries: {
		retry: 2,
		staleTime: 60 * 1000,
		gcTime: 5 * 60 * 1000,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
	},
	mutations: {
		retry: 1,
	},
};

const mergeDefaultOptions = (options?: DefaultOptions): DefaultOptions => {
	const overrides = options ?? {};

	return {
		...baseDefaultOptions,
		...overrides,
		queries: {
			...baseDefaultOptions.queries,
			...overrides.queries,
		},
		mutations: {
			...baseDefaultOptions.mutations,
			...overrides.mutations,
		},
	};
};

export const createQueryClient = (options?: DefaultOptions) =>
	new QueryClient({
		defaultOptions: mergeDefaultOptions(options),
	});

export const defaultQueryClientOptions = baseDefaultOptions;
