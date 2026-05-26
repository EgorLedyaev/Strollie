import type { ImageSourcePropType } from 'react-native';

export interface Place {
	id: string;
	title: string;
	address: string;
	category: 'Ресторан' | 'Кафе' | 'Магазин' | 'Парк' | 'Музей' | 'Другое';
	description?: string;
	images: ImageSourcePropType[];
	isFavorite?: boolean;
}
