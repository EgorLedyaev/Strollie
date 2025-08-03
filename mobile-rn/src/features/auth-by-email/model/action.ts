import { atom, type Getter, type Setter } from 'jotai';

import { userApi } from '@/src/entities/user';

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
		console.log(
			'Отправка данных для регистрации и запрос кода для:',
			state.email,
		);
		await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки сети

		// Если бэкенд подтвердил, что данные приняты и код отправлен, вызываем onSuccess.
		onSuccess();
	} catch (err) {
		console.error('Ошибка при отправке данных регистрации', err);
		set(
			registrationErrorAtom,
			'Не удалось отправить данные для регистрации.',
		);
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
	const email = state.email;

	set(registrationIsLoadingAtom, true);
	set(registrationErrorAtom, null);

	try {
		// 1. Валидация формата email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || !email.trim() || !emailRegex.test(email)) {
			throw new Error('Введите корректный email');
		}

		// 2. Проверка на уникальность (имитация API-запроса)
		// Имитируем задержку сети для реалистичности
		await new Promise(resolve => setTimeout(resolve, 500));
		const isAlreadyRegistered = await userApi.isUserRegistered(email);
		if (isAlreadyRegistered) {
			throw new Error(
				'Этот email уже зарегистрирован. Попробуйте войти.',
			);
		}

		// Все проверки пройдены
		state.isRegistering = true; // Устанавливаем состояние регистрации
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
