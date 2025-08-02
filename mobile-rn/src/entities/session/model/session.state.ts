import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import { SessionStorage } from './session-storage';

/**
 * Тип для состояния сессии.
 * Содержит информацию о том, аутентифицирован ли пользователь и его refresh токен.
 */
interface Session {
	isAuthenticated: boolean;
	refreshToken: string | null;
}

/**
 * Начальное состояние сессии.
 * По умолчанию пользователь не аутентифицирован и refresh токен отсутствует.
 */
const INITIAL_STATE: Session = {
	isAuthenticated: false,
	refreshToken: null,
};
/**
 * Хранилище для состояния сессии.
 * Используется для сохранения и извлечения данных сессии из AsyncStorage.
 */
const storage = createJSONStorage<Session>(() => AsyncStorage);

/**
 * Атом для хранения состояния сессии.
 */
export const sessionAtom = atomWithStorage('session', INITIAL_STATE, storage);

/**
 * Атом для проверки аутентификации пользователя (read-only).
 */
export const isAuthenticatedAtom = atom(async get => {
	const session = await get(sessionAtom);
	return session.isAuthenticated;
});

/**
 * Атом для выхода из системы (write-only).
 * При вызове этого атома будет очищено состояние сессии и удалены все данные из хранилища.
 */
export const logoutAtom = atom(null, async (_get, set) => {
	await SessionStorage.clearAll();
	set(sessionAtom, INITIAL_STATE);
});
