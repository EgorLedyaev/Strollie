// Публичный API слайса session
import { sessionAtom, isAuthenticatedAtom, logoutAtom } from './model/session.state';
import { SessionStorage } from './model/session-storage';

export {
  // State
  sessionAtom,
  isAuthenticatedAtom,
  logoutAtom,
  
  // Storage
  SessionStorage
};
