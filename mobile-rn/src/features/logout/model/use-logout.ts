import { useSetAtom } from 'jotai';
import { logoutAtom } from '@/src/entities/session/model/session.state';

export const useLogout = () => {
  const logout = useSetAtom(logoutAtom);
  
  return logout;
};
