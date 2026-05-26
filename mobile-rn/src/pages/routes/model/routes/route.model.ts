import type { ImageSourcePropType } from 'react-native';

export type RouteTags = 'Пеший' | 'Спорт' | 'Одиночный' | 'Другое';

export interface Route {
	id: string;
	title: string;
	date: string;
	distance: string;
	duration: string;
	startPoint: string;
	endPoint: string;
	tags: RouteTags[];
	images: ImageSourcePropType[];
	isFavorite?: boolean;
}
