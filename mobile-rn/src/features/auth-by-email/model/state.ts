import { atom } from 'jotai';

/**
 * Тип для данных, собираемых в процессе регистрации
 * @property {string} email - Email пользователя
 * @property {string} firstName - Имя пользователя
 * @property {string} lastName - Фамилия пользователя
 * @property {string} city - Город пользователя
 * @property {string} birthdate - Дата рождения пользователя
 * @property {string} nickname - Никнейм пользователя
 */
export interface RegistrationData {
	email: string;
	firstName: string;
	lastName: string;
	city: string;
	birthdate: string;
	nickname: string;
}

/**
 * Атом для хранения состояния регистрации.
 * Используется для управления данными формы регистрации.
 */
export const registrationStateAtom = atom<
	Partial<RegistrationData> & { isRegistering: boolean }
>({
	email: '',
	firstName: '',
	lastName: '',
	city: '',
	birthdate: '',
	nickname: '',
	isRegistering: false, // Флаг, указывающий, что идет процесс регистрации
});

/**
 * Атом для отслеживания состояния загрузки регистрации.
 * Используется для отображения индикатора загрузки.
 */
export const registrationIsLoadingAtom = atom(false);

/**
 * Атом для хранения ошибок регистрации.
 * Используется для отображения сообщений об ошибках.
 */
export const registrationErrorAtom = atom<string | null>(null);

/**
 * Атом для отслеживания состояния аутентификации.
 * Используется для управления состоянием входа в систему.
 */
export const authIsLoadingAtom = atom(false);

/**
 * Атом для хранения ошибок аутентификации.
 * Используется для отображения сообщений об ошибках при входе в систему.
 */
export const authErrorAtom = atom<string | null>(null);

/**
 * Атом для хранения ошибок верификации кода.
 */
export const verifyCodeErrorAtom = atom<string | null>(null);
