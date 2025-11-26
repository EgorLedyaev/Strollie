import {
	addDays,
	eachDayOfInterval,
	format,
	isSameDay as isSameDayFns,
	isValid,
	parse,
	startOfMonth,
	startOfWeek,
	toDate,
} from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (
	date: Date | string | number,
	formatStr: string = 'dd.MM.yyyy',
): string => {
	if (!date) return '';
	const d = toDate(date);
	if (!isValid(d)) return '';
	return format(d, formatStr, { locale: ru });
};

/**
 * Форматирует дату в формате DD.MM.YYYY
 */
export const formatDateToDDMMYYYY = (date: Date): string => {
	return formatDate(date, 'dd.MM.yyyy');
};

/**
 * Форматирует дату в коротком формате "Вт, 18 фев."
 */
export const formatDateToShortDisplay = (date: Date): string => {
	const formatted = format(date, 'EEE, d MMM.', { locale: ru });
	return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

/**
 * Форматирует время в формате HH:MM
 */
export const formatTimeToHHMM = (date: Date): string => {
	return format(date, 'HH:mm');
};

/**
 * Проверяет, что две даты - это один и тот же день
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
	return isSameDayFns(date1, date2);
};

/**
 * Возвращает массив дат для отображения календаря за месяц
 */
export const getMonthDays = (year: number, month: number): Date[] => {
	const date = new Date(year, month, 1);
	const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 }); // Monday start
	// We need 42 days (6 weeks)
	const end = addDays(start, 41);

	return eachDayOfInterval({ start, end });
};

export { format, isValid, parse };
export { ru } from 'date-fns/locale';
