import { useSetAtom } from 'jotai';

import { logoutAtom } from '@/src/entities/session';

export const useLogout = () => {
	const logout = useSetAtom(logoutAtom);

	return logout;
};
