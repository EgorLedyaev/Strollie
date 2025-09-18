/**
 * Форматирует дату в формате DD.MM.YYYY
 */
export const formatDateToDDMMYYYY = (date: Date): string => {
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0'); // месяцы начинаются с 0
	const year = date.getFullYear();

	return `${day}.${month}.${year}`;
};

/**
 * Форматирует дату в коротком формате "Вт, 18 фев."
 */
export const formatDateToShortDisplay = (date: Date): string => {
	const dayOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getDay()];
	const day = date.getDate();

	const months = [
		'янв',
		'фев',
		'мар',
		'апр',
		'май',
		'июн',
		'июл',
		'авг',
		'сен',
		'окт',
		'ноя',
		'дек',
	];
	const month = months[date.getMonth()];

	return `${dayOfWeek}, ${day} ${month}.`;
};

/**
 * Форматирует время в формате HH:MM
 */
export const formatTimeToHHMM = (date: Date): string => {
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	return `${hours}:${minutes}`;
};

/**
 * Проверяет, что две даты - это один и тот же день
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
	return (
		date1.getDate() === date2.getDate() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getFullYear() === date2.getFullYear()
	);
};

/**
 * Возвращает массив дат для отображения календаря за месяц
 */
export const getMonthDays = (year: number, month: number): Date[] => {
	const result: Date[] = [];

	// Первый день месяца
	const firstDayOfMonth = new Date(year, month, 1);
	// День недели первого дня (0 - воскресенье, 1 - понедельник, и т.д.)
	let firstDayOfWeek = firstDayOfMonth.getDay();
	// Корректировка, чтобы неделя начиналась с понедельника
	firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

	// Добавляем дни предыдущего месяца
	const lastDayOfPrevMonth = new Date(year, month, 0);
	const daysInPrevMonth = lastDayOfPrevMonth.getDate();

	for (let i = 0; i < firstDayOfWeek; i++) {
		const day = daysInPrevMonth - firstDayOfWeek + i + 1;
		result.push(new Date(year, month - 1, day));
	}

	// Добавляем дни текущего месяца
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	for (let i = 1; i <= daysInMonth; i++) {
		result.push(new Date(year, month, i));
	}

	// Добавляем дни следующего месяца, чтобы заполнить сетку
	// (обычно 6 рядов по 7 дней = 42 ячейки)
	const totalCells = 42;
	const remainingDays = totalCells - result.length;

	for (let i = 1; i <= remainingDays; i++) {
		result.push(new Date(year, month + 1, i));
	}

	return result;
};
