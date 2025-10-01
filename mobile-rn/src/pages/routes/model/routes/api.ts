import walk_image from '@/assets/images/routes/embankment.png';
import stadium_image from '@/assets/images/routes/sports.png';

import type { Route } from './route.model';

export const MOCK_ROUTES: Route[] = [
	{
		id: '1',
		title: 'Прогулка по набережной',
		date: new Date().toISOString(),
		distance: '3,3 км',
		duration: '58 мин',
		startPoint: 'Чернышевского, 132',
		endPoint: 'Ресурс',
		tags: ['Одиночный', 'Пеший'],
		images: [walk_image, walk_image],
		isFavorite: true,
	},
	{
		id: '2',
		title: 'Пробежка на стадионе',
		date: '2023-10-20T10:00:00.000Z',
		distance: '10,1 км',
		duration: '1 ч 15 мин',
		startPoint: 'Чернышевского, 12',
		endPoint: 'Рахова, 24',
		tags: ['Одиночный', 'Спорт'],
		images: new Array(10).fill(stadium_image),
		isFavorite: false,
	},
	{
		id: '3',
		title: 'Пробежка на стадионе',
		date: '2023-10-20T10:00:00.000Z',
		distance: '10,1 км',
		duration: '1 ч 15 мин',
		startPoint: 'Чернышевского, 12',
		endPoint: 'Рахова, 24',
		tags: ['Одиночный', 'Спорт'],
		images: new Array(10).fill(stadium_image),
		isFavorite: false,
	},
];

const getMyRoutes = async (): Promise<Route[]> => {
	console.log('[routes] Fetching routes...');
	return new Promise(resolve => {
		setTimeout(() => {
			console.log('[routes] Routes fetched.');
			resolve(MOCK_ROUTES);
		}, 1200);
	});
};

export const routesApi = {
	getMyRoutes,
};
