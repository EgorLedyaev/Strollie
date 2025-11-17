import { atom, type Getter, type Setter } from 'jotai';

import { requestOneTimeCode } from '@/shared/api';

import {
	registrationErrorAtom,
	registrationIsLoadingAtom,
	registrationStateAtom,
} from './state';

/**
 * Экшен для завершения регистрации пользователя.
 */
interface SubmitUserDataArgs {
	onSuccess: () => void;
}

/**
 * Экшен для отправки данных пользователя и запроса кода верификации.
 * Вызывается со страницы UserDataPage.
 * @param get - функция для получения состояния атомов.
 * @param set - функция для установки состояния атомов.
 * @returns Promise<void>
 */
const submitUserDataAction = async (
	get: Getter,
	set: Setter,
	{ onSuccess }: SubmitUserDataArgs,
): Promise<void> => {
	const state = get(registrationStateAtom);

	if (!state.email || !state.firstName || !state.lastName) {
		set(registrationErrorAtom, 'Пожалуйста, заполните все поля.');
		return;
	}

	set(registrationIsLoadingAtom, true);
	set(registrationErrorAtom, null);

	try {
		// Имитируем отправку данных на бэкенд и запрос кода.
		// В реальном приложении здесь будет API-вызов.
		const normalizedEmail = state.email?.trim().toLowerCase();
		if (!normalizedEmail) {
			throw new Error(
				'Не удалось определить email. Вернитесь на предыдущий шаг.',
			);
		}

		await requestOneTimeCode(normalizedEmail);
		onSuccess();
	} catch (err) {
		console.error('Ошибка при отправке данных регистрации', err);
		const message =
			err instanceof Error
				? err.message
				: 'Не удалось отправить данные для регистрации.';
		set(registrationErrorAtom, message);
	} finally {
		set(registrationIsLoadingAtom, false);
	}
};

/**
 * Write-only атом для запуска процесса отправки данных пользователя.
 */
export const submitUserDataAtom = atom(null, submitUserDataAction);

/**
 * Тип для аргументов, передаваемых в экшен проверки email.
 */
interface CheckEmailArgs {
	onSuccess: () => void;
}

/**
 * Экшен для проверки email и перехода к следующему шагу регистрации.
 * @param get - функция для получения состояния атомов.
 * @param set - функция для установки состояния атомов.
 * @param param2 - объект с коллбэком onSuccess.
 */
const checkEmailAndProceedAction = async (
	get: Getter,
	set: Setter,
	{ onSuccess }: CheckEmailArgs,
): Promise<void> => {
	const state = get(registrationStateAtom);
	const email = state.email?.trim().toLowerCase();

	set(registrationIsLoadingAtom, true);
	set(registrationErrorAtom, null);

	try {
		// 1. Валидация формата email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || !email.trim() || !emailRegex.test(email)) {
			throw new Error('Введите корректный email');
		}

		// Сохраняем нормализованный email и помечаем, что мы в потоке регистрации
		set(registrationStateAtom, prev => ({
			...prev,
			email,
			isRegistering: true,
		}));
		onSuccess();
	} catch (err) {
		const message =
			err instanceof Error
				? err.message
				: 'Произошла неизвестная ошибка.';
		console.error('Ошибка проверки email', err);
		set(registrationErrorAtom, message);
	} finally {
		set(registrationIsLoadingAtom, false);
	}
};

/**
 * Write-only атом для проверки email и перехода к следующему шагу регистрации.
 */
export const checkEmailAndProceedAtom = atom(null, checkEmailAndProceedAction);
