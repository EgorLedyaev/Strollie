import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { createQueryFn, sessionKeys } from '@/shared/api';

import { sessionAtom, type SessionSnapshot } from './session.state';

const fetchSessionSnapshot = createQueryFn<SessionSnapshot>(() => ({
	url: '/auth/session',
	method: 'GET',
}));

/**
 * Хук для получения снимка текущей сессии через TanStack Query.
 * Реальный backend может не быть готов, поэтому при ошибке мы откатываемся
 * к локальному состоянию, чтобы не ломать текущий флоу аутентификации.
 */
export const useSessionQuery = () => {
	const localSession = useAtomValue(sessionAtom);
	const queryClient = useQueryClient();

	useEffect(() => {
		queryClient.setQueryData(sessionKeys.all, localSession);
	}, [localSession, queryClient]);

	return useQuery({
		queryKey: sessionKeys.all,
		queryFn: async () => {
			try {
				return await fetchSessionSnapshot();
			} catch (error) {
				console.warn(
					'Сервис сессии недоступен, используем локальный снапшот.',
					error,
				);
				return localSession;
			}
		},
		initialData: localSession,
		placeholderData: previous => previous ?? localSession,
		staleTime: 5 * 60 * 1000,
	});
};
