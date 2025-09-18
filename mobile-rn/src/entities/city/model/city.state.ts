import { atom } from 'jotai';

import { type SelectOption } from '@/shared/ui';

import { getCities } from '../api/api';

// Атом для хранения списка городов
export const citiesAtom = atom<SelectOption[]>([]);
// Атом для состояния загрузки
export const citiesIsLoadingAtom = atom(false);
// Атом для ошибок
export const citiesErrorAtom = atom<string | null>(null);

// "Write-only" атом для запуска загрузки данных.
// Компоненты будут вызывать его, чтобы инициировать получение данных.
export const fetchCitiesAtom = atom(null, async (get, set) => {
	if (get(citiesIsLoadingAtom)) {
		return; // Предотвращаем повторные запросы, если один уже идет
	}
	set(citiesIsLoadingAtom, true);
	set(citiesErrorAtom, null);
	try {
		const cities = await getCities();
		set(citiesAtom, cities);
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: 'Не удалось загрузить города';
		set(citiesErrorAtom, message);
		console.error(message);
	} finally {
		set(citiesIsLoadingAtom, false);
	}
});
