import { atom, type Getter } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { resetUserProfileAtom, type User } from '@/entities/user/@x/session';
import {
	apiClient,
	refreshAccessToken,
	revokeRefreshToken,
} from '@/shared/api';
import { SESSION_STORAGE_KEY } from '@/shared/config';
import { secureAtomStorage } from '@/shared/lib/secure-storage';

interface AsyncStorage<Value> {
	getItem: (key: string, initialValue?: Value) => Promise<Value>;
	setItem: (key: string, newValue: Value) => Promise<void>;
	removeItem: (key: string) => Promise<void>;
	subscribe?: (
		key: string,
		callback: (value: Value) => void,
		initialValue?: Value,
	) => () => void;
}

/**
 * Тип для состояния сессии.
 * Содержит информацию о том, аутентифицирован ли пользователь и его refresh токен.
 */
export interface SessionSnapshot {
	isAuthenticated: boolean;
	accessToken: string | null;
	refreshToken: string | null | undefined;
	tokenType: string | null;
	userProfile: User | null;
}

/**
 * Начальное состояние сессии.
 * По умолчанию пользователь не аутентифицирован и refresh токен отсутствует.
 */
const INITIAL_STATE: SessionSnapshot = {
	isAuthenticated: false,
	accessToken: null,
	refreshToken: undefined,
	tokenType: null,
	userProfile: null,
};

const CLEARED_STATE: SessionSnapshot = {
	...INITIAL_STATE,
	refreshToken: null,
};

const applyAuthHeader = (session: SessionSnapshot) => {
	if (session.accessToken) {
		apiClient.defaults.headers.common.Authorization = `${
			session.tokenType ?? 'Bearer'
		} ${session.accessToken}`;
	} else {
		delete apiClient.defaults.headers.common.Authorization;
	}
};

/**
 * Хранилище для состояния сессии.
 * Используется для сохранения и извлечения данных сессии из SecureStore.
 */
const storage = secureAtomStorage as AsyncStorage<SessionSnapshot>;

/**
 * Базовый атом для хранения состояния сессии. Он взаимодействует с AsyncStorage.
 * Мы не будем экспортировать его напрямую, чтобы избежать случайного использования
 * без Suspense.
 */
const sessionAtomWithStorage = atomWithStorage<SessionSnapshot>(
	SESSION_STORAGE_KEY,
	INITIAL_STATE,
	storage,
);

const readSession = (get: Getter): SessionSnapshot =>
	get(sessionAtomWithStorage) as SessionSnapshot;

/**
 * Экспортируемый атом сессии, который поддерживает Suspense.
 * Когда компонент попытается прочитать этот атом до того, как данные загрузятся
 * из AsyncStorage, Jotai "выбросит" промис, который будет перехвачен
 * ближайшим <Suspense> boundary.
 */
export const sessionAtom = atom<SessionSnapshot>(
	get => get(sessionAtomWithStorage) as SessionSnapshot,
);

/**
 * Атом для ПРЯМОЙ установки новой сессии.
 * Используется после успешной верификации.
 * ЭТО write-only атом.
 */
interface NewSessionPayload {
	accessToken: string;
	refreshToken: string;
	tokenType?: string | null;
	userProfile?: User | null;
}

export const setSessionAtom = atom(
	null,
	(get, set, newSessionData: NewSessionPayload) => {
		const newSession: SessionSnapshot = {
			isAuthenticated: true,
			accessToken: newSessionData.accessToken,
			refreshToken: newSessionData.refreshToken,
			tokenType: newSessionData.tokenType ?? 'Bearer',
			userProfile: newSessionData.userProfile ?? null,
		};
		applyAuthHeader(newSession);
		set(sessionAtomWithStorage, newSession);
	},
);

export const refreshSessionAtom = atom(null, async (get, set) => {
	const current = readSession(get);
	if (!current.refreshToken) {
		return;
	}
	try {
		const tokens = await refreshAccessToken(current.refreshToken);
		const updatedSession: SessionSnapshot = {
			...current,
			isAuthenticated: true,
			accessToken: tokens.access_token,
			tokenType: tokens.token_type ?? current.tokenType ?? 'Bearer',
		};
		applyAuthHeader(updatedSession);
		set(sessionAtomWithStorage, updatedSession);
	} catch (error) {
		console.warn(
			'Не удалось обновить access токен, выполняем выход',
			error,
		);
		// Если refresh не удался, очищаем сессию полностью.
		set(resetUserProfileAtom);
		applyAuthHeader(CLEARED_STATE);
		set(sessionAtomWithStorage, CLEARED_STATE);
	}
});

/**
 * Атом для выхода из системы (write-only).
 */
export const logoutAtom = atom(null, async (get, set) => {
	const current = readSession(get);
	const refreshToken = current.refreshToken;
	try {
		if (refreshToken) {
			await revokeRefreshToken(refreshToken);
		}
	} catch (error) {
		console.warn('Не удалось отозвать refresh токен при выходе', error);
	} finally {
		set(resetUserProfileAtom);
		applyAuthHeader(CLEARED_STATE);
		set(sessionAtomWithStorage, CLEARED_STATE);
	}
});
