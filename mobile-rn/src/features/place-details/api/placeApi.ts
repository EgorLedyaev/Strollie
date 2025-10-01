// API клиент для работы с 2GIS

import type {
	ContactGroup,
	Photo,
	Place,
	Review,
	Schedule,
} from '../model/types';

const API_BASE_URL = 'https://catalog.api.2gis.com/3.0';
const API_KEY = process.env.EXPO_PUBLIC_2GIS_API_KEY || '';

// Проверяем наличие API ключа при загрузке модуля
if (!API_KEY) {
	console.error(
		'EXPO_PUBLIC_2GIS_API_KEY не установлен! API запросы не будут работать.',
	);
}

interface PlaceItem {
	id: string;
	name: string;
	rubrics?: Array<{ name: string }>;
	address_name?: string;
	full_name?: string;
	building_name?: string;
	point: { lat: number; lon: number };
	contact_groups?: ContactGroup[];
	schedule?: Schedule;
	reviews?: {
		general_rating?: number;
		general_review_count?: number;
	};
}

interface PlaceSearchResponse {
	meta: {
		code: number;
		error?: {
			type: string;
			message: string;
		};
	};
	result: {
		items: PlaceItem[];
		total: number;
	};
}

/**
 * Получить подробную информацию о месте по ID
 */
export async function fetchPlaceDetails(placeId: string): Promise<Place> {
	try {
		const response = await fetch(
			`${API_BASE_URL}/items/byid?id=${placeId}&fields=items.point,items.adm_div,items.address,items.schedule,items.contact_groups,items.reviews&key=${API_KEY}`,
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch place details: ${response.statusText}`,
			);
		}

		const data: PlaceSearchResponse = await response.json();

		if (data.meta.code !== 200 || !data.result.items.length) {
			throw new Error(data.meta.error?.message || 'Place not found');
		}

		const item = data.result.items[0];

		return {
			id: item.id,
			name: item.name,
			type: item.rubrics?.[0]?.name || 'Место',
			address: {
				name: item.address_name || '',
				full_name: item.full_name,
				building_name: item.building_name,
			},
			point: item.point,
			contact_groups: item.contact_groups,
			schedule: item.schedule,
			photos: [],
			reviews: [],
			review_stats: item.reviews
				? {
						average_rating: item.reviews.general_rating || 0,
						total_count: item.reviews.general_review_count || 0,
						rating_distribution: {
							5: 0,
							4: 0,
							3: 0,
							2: 0,
							1: 0,
						},
					}
				: undefined,
		};
	} catch (error) {
		console.error('Error fetching place details:', error);
		throw error;
	}
}

/**
 * Получить фотографии места
 */
export async function fetchPlacePhotos(placeId: string): Promise<Photo[]> {
	try {
		void placeId;
		// 2GIS API не предоставляет прямой эндпоинт для фотографий
		// В реальном проекте здесь может быть интеграция с другим сервисом
		// или использование поля photos из основного запроса
		return [];
	} catch (error) {
		console.error('Error fetching place photos:', error);
		return [];
	}
}

/**
 * Получить отзывы о месте
 */
export async function fetchPlaceReviews(placeId: string): Promise<Review[]> {
	try {
		void placeId;
		// 2GIS API предоставляет базовую статистику отзывов, но не сами отзывы
		// В реальном проекте здесь нужна интеграция с сервисом отзывов
		return [];
	} catch (error) {
		console.error('Error fetching place reviews:', error);
		return [];
	}
}

/**
 * Отправить новый отзыв
 */
export async function submitReview(
	placeId: string,
	rating: number,
	text: string,
): Promise<Review> {
	try {
		// Здесь должна быть реальная интеграция с бэкендом
		// Пока возвращаем мок
		const newReview: Review = {
			id: Date.now().toString(),
			user_name: 'Текущий пользователь',
			rating,
			text,
			date: new Date().toISOString(),
			is_current_user: true,
		};

		return newReview;
	} catch (error) {
		console.error('Error submitting review:', error);
		throw error;
	}
}

/**
 * Поиск мест по координатам (для получения ближайших объектов)
 */
export async function searchPlacesByCoordinates(
	lat: number,
	lon: number,
	radius: number = 1000,
): Promise<Place[]> {
	try {
		const url = `${API_BASE_URL}/items?point=${lon},${lat}&radius=${radius}&type=branch&fields=items.point,items.adm_div,items.address&key=${API_KEY}`;
		console.log('2GIS API request:', url);

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to search places: ${response.statusText}`);
		}

		const data: PlaceSearchResponse = await response.json();

		// Добавляем логирование структуры ответа для диагностики
		console.log('2GIS API response:', JSON.stringify(data, null, 2));

		// Проверяем мета-код
		if (data.meta && data.meta.code !== 200) {
			console.error('2GIS API error:', data.meta.error);
			return [];
		}

		// Проверяем наличие данных в ответе
		if (
			!data ||
			!data.result ||
			!data.result.items ||
			data.result.items.length === 0
		) {
			console.log('2GIS API вернул пустой результат');
			return [];
		}

		console.log(`2GIS API вернул ${data.result.items.length} мест`);

		return data.result.items.map(item => ({
			id: item.id,
			name: item.name,
			type: item.rubrics?.[0]?.name || 'Место',
			address: {
				name: item.address_name || '',
				full_name: item.full_name,
			},
			point: item.point,
		}));
	} catch (error) {
		console.error('Error searching places:', error);
		return [];
	}
}
