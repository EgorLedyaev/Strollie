import { SelectOption } from "@/shared/ui";

const MOCKED_CITIES: SelectOption[] = [
	{ label: 'Калининград', value: 'kaliningrad' },
	{ label: 'Москва', value: 'moscow' },
	{ label: 'Санкт-Петербург', value: 'spb' },
	{ label: 'Екатеринбург', value: 'ekb' },
	{ label: 'Казань', value: 'kazan' },
	{ label: 'Нижний Новгород', value: 'nizhny-novgorod' },
	{ label: 'Челябинск', value: 'chelyabinsk' },
	{ label: 'Самара', value: 'samara' },
	{ label: 'Омск', value: 'omsk' },
	{ label: 'Ростов-на-Дону', value: 'rostov-on-don' },
	{ label: 'Уфа', value: 'ufa' },
	{ label: 'Красноярск', value: 'krasnoyarsk' },
	{ label: 'Новосибирск', value: 'novosibirsk' },
	{ label: 'Пермь', value: 'perm' },
	{ label: 'Воронеж', value: 'voronezh' },
	{ label: 'Волгоград', value: 'volgograd' },
];

// Эта функция имитирует запрос к API.
export const getCities = async (): Promise<SelectOption[]> => {
	console.log('Fetching cities (mock)...');
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(MOCKED_CITIES);
		}, 500);
	});
};