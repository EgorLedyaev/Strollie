// Публичный API слайса session
import { useSessionQuery } from './model/session.queries';
import {
	logoutAtom,
	refreshSessionAtom,
	sessionAtom,
	setSessionAtom,
} from './model/session.state';

export {
	// State
	sessionAtom,
	logoutAtom,
	setSessionAtom,
	refreshSessionAtom,
	// Queries
	useSessionQuery,
};
