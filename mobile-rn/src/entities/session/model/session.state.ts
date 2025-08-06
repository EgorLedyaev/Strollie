import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import type { User } from '@/entities/user/@x/session';

/**
 * Тип для состояния сессии.
 * Содержит информацию о том, аутентифицирован ли пользователь и его refresh токен.
 */
interface Session {
	isAuthenticated: boolean;
	refreshToken: string | null;
	userProfile: User | null;
}

/**
 * Начальное состояние сессии.
 * По умолчанию пользователь не аутентифицирован и refresh токен отсутствует.
 */
const INITIAL_STATE: Session = {
	isAuthenticated: false,
	refreshToken: null,
	userProfile: null,
};
/**
 * Хранилище для состояния сессии.
 * Используется для сохранения и извлечения данных сессии из AsyncStorage.
 */
const storage = createJSONStorage<Session>(() => AsyncStorage);

/**
 * Базовый атом для хранения состояния сессии. Он взаимодействует с AsyncStorage.
 * Мы не будем экспортировать его напрямую, чтобы избежать случайного использования
 * без Suspense.
 */
const sessionAtomWithStorage = atomWithStorage(
	'session',
	INITIAL_STATE,
	storage,
);

/**
 * Экспортируемый атом сессии, который поддерживает Suspense.
 * Когда компонент попытается прочитать этот атом до того, как данные загрузятся
 * из AsyncStorage, Jotai "выбросит" промис, который будет перехвачен
 * ближайшим <Suspense> boundary.
 */
export const sessionAtom = atom(get => get(sessionAtomWithStorage));

/**
 * Атом для ПРЯМОЙ установки новой сессии.
 * Используется после успешной верификации.
 * ЭТО write-only атом.
 */
export const setSessionAtom = atom(
	null,
	(get, set, newSessionData: { refreshToken: string; userProfile: User }) => {
		const newSession: Session = {
			isAuthenticated: true,
			...newSessionData,
		};
		set(sessionAtomWithStorage, newSession);
	},
);

/**
 * Атом для выхода из системы (write-only).
 */
export const logoutAtom = atom(null, async (_get, set) => {
	set(sessionAtomWithStorage, INITIAL_STATE);
});
