import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';

import { routeApi } from '../api/routeApi';
import { Route } from './route.model';
import {
	hydrateRoutesAtom,
	routesAtom,
	routesHydratedAtom,
	setRoutesAtom,
} from './route.state';

interface UseRoutesSWRResult {
	routes: Route[];
	isHydrated: boolean;
	isLoading: boolean;
	error: Error | null;
	forceRefresh: () => Promise<void>;
}

export function useRoutesSWR(): UseRoutesSWRResult {
	const [routes] = useAtom(routesAtom);
	const [hydrated] = useAtom(routesHydratedAtom);
	const [, hydrate] = useAtom(hydrateRoutesAtom);
	const [, setRoutes] = useAtom(setRoutesAtom);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		hydrate();
	}, [hydrate]);

	const doFetch = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await routeApi.getMyRoutes();

			setRoutes(data);
		} catch (e) {
			setError(e instanceof Error ? e : new Error('Unknown error'));
		} finally {
			setIsLoading(false);
		}
	}, [setRoutes]);

	useEffect(() => {
		if (hydrated && routes.length === 0) {
			void doFetch();
		}
	}, [hydrated, routes.length, doFetch]);

	return {
		routes,
		isHydrated: hydrated,
		isLoading: !hydrated || isLoading,
		error,
		forceRefresh: doFetch,
	};
}
