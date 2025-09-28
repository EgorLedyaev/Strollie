import oreo_image from '@/assets/images/routes/oreo.png';

import { Place } from '@/entities/place';

export const MOCK_PLACES: Place[] = [
	{
		id: '1',
		title: 'OREO',
		address: 'г. Саратов, ул. им. Н.Г. Чернышевского, 88К',
		category: 'Кафе',
		images: [oreo_image, oreo_image],
		isFavorite: true,
	},
];

const getMyPlaces = (): Promise<Place[]> => {
	console.log('[placeApi] Fetching places...');
	return new Promise(resolve => {
		setTimeout(() => {
			console.log('[placeApi] Places fetched.');
			resolve(MOCK_PLACES);
		}, 1200);
	});
};

export const placeApi = {
	getMyPlaces,
};
