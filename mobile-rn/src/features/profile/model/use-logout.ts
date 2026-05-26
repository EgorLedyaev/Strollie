import { useSetAtom } from 'jotai';

import { logoutAtom } from '@/entities/session';

export const useLogout = () => {
	const logout = useSetAtom(logoutAtom);
	return logout;
};
