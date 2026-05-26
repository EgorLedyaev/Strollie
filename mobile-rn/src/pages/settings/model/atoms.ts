import { atom } from 'jotai';

// Хранит новый email, который вводит пользователь
export const newEmailAtom = atom<string>('');

// Состояние загрузки для процесса смены почты
export const changeEmailIsLoadingAtom = atom<boolean>(false);

// Ошибка на экране ввода нового email
export const requestChangeErrorAtom = atom<string | null>(null);

// Ошибка на экране верификации кода
export const verifyChangeErrorAtom = atom<string | null>(null);
