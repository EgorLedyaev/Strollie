// Публичный API слайса session
import { SessionStorage } from './model/session-storage';
import {
	isAuthenticatedAtom,
	logoutAtom,
	sessionAtom,
} from './model/session.state';

export {
	// State
	sessionAtom,
	isAuthenticatedAtom,
	logoutAtom,

	// Storage
	SessionStorage,
};
