import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionStorage } from './session-storage';

interface Session {
  isAuthenticated: boolean;
  refreshToken: string | null;
}

const INITIAL_STATE: Session = {
  isAuthenticated: false,
  refreshToken: null,
};

const storage = createJSONStorage<Session>(() => AsyncStorage);

// Основной атом, который будет хранить состояние сессии
export const sessionAtom = atomWithStorage('session', INITIAL_STATE, storage);

// Атом только для чтения, чтобы легко проверять аутентификацию
export const isAuthenticatedAtom = atom(async get => {
  const session = await get(sessionAtom);
  return session.isAuthenticated;
});

// Атом для выхода из системы (write-only)
export const logoutAtom = atom(
  null,
  async (_get, set) => {
    await SessionStorage.clearAll();
    set(sessionAtom, INITIAL_STATE);
  }
);
