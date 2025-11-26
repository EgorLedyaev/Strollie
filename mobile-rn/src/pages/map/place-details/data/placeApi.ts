// API клиент для работы с 2GIS

import { formatISO } from 'date-fns';

import type {
	Contact,
	ContactGroup,
	Photo,
	Place,
	Review,
	Schedule,
} from '../types';

const API_BASE_URL = 'https://catalog.api.2gis.com/3.0';
const API_KEY = process.env.EXPO_PUBLIC_2GIS_API_KEY || '';

// Проверяем наличие API ключа при загрузке модуля
if (!API_KEY) {
	console.error(
		'EXPO_PUBLIC_2GIS_API_KEY не установлен! API запросы не будут работать.',
	);
}

interface AddressComponent {
	type: string;
	name?: string;
	number?: string;
	street?: string;
	settlement?: string;
	city?: string;
}

interface AdmDivItem {
	type: string;
	name: string;
	short_name?: string;
}

interface NameExItem {
	primary?: string;
	short?: string;
	value?: string;
}

interface PlaceLinksServicingItem {
	name?: string;
	additional_info?: string;
	contacts?: Contact[];
}

interface PlaceLinks {
	servicing?: {
		items?: PlaceLinksServicingItem[];
	};
}

interface PlaceItem {
	id: string;
	name: string;
	rubrics?: Array<{ name: string }>;
	address_name?: string;
	full_address_name?: string;
	building_name?: string;
	point: { lat: number; lon: number };
	contact_groups?: ContactGroup[];
	schedule?: Schedule;
	reviews?: {
		general_rating?: number;
		general_review_count?: number;
	};
	links?: PlaceLinks;
	address?: {
		components?: AddressComponent[];
	};
	adm_div?: AdmDivItem[];
	purpose_name?: string;
	name_ex?: NameExItem;
	distance?: number;
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
		const detailsFields = [
			'items.point',
			'items.name',
			'items.name_ex',
			'items.purpose_name',
			'items.rubrics',
			'items.adm_div',
			'items.address',
			'items.full_address_name',
			'items.building_name',
			'items.schedule',
			'items.contact_groups',
			'items.links.servicing',
			'items.reviews',
		];

		const response = await fetch(
			`${API_BASE_URL}/items/byid?id=${placeId}&fields=${detailsFields.join(',')}&key=${API_KEY}`,
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

		return normalizePlace(item);
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
			date: formatISO(new Date()),
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
 *
 * Использует Geocode API для точного поиска по координатам клика
 * Документация: https://docs.2gis.com/ru/api/search/geocoder/reference
 */
export async function searchPlacesByCoordinates(
	lat: number,
	lon: number,
	radius: number = 50, // 50 метров - оптимальный радиус для клика
): Promise<Place[]> {
	try {
		const params = new URLSearchParams({
			lat: String(lat),
			lon: String(lon),
			radius: String(radius),
			type: 'building,attraction',
			fields: [
				'items.point',
				'items.name',
				'items.name_ex',
				'items.purpose_name',
				'items.address',
				'items.full_address_name',
				'items.building_name',
				'items.adm_div',
				'items.rubrics',
				'items.contact_groups',
				'items.schedule',
				'items.reviews',
				'items.links.servicing',
			].join(','),
			sort: 'distance',
			search_nearby: 'true',
			page: '1',
			page_size: '1',
			key: API_KEY,
		});

		const url = `${API_BASE_URL}/items/geocode?${params.toString()}`;

		console.log('🔍 2GIS Geocode API request:', url);

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to search places: ${response.statusText}`);
		}

		const data: PlaceSearchResponse = await response.json();

		// Добавляем логирование структуры ответа для диагностики
		console.log('✅ 2GIS API response:', JSON.stringify(data, null, 2));

		// Проверяем мета-код
		if (data.meta && data.meta.code !== 200) {
			console.error('❌ 2GIS API error:', data.meta.error);
			return [];
		}

		// Проверяем наличие данных в ответе
		if (
			!data ||
			!data.result ||
			!data.result.items ||
			data.result.items.length === 0
		) {
			console.log(
				'⚠️ 2GIS API вернул пустой результат (нет объектов в радиусе 50м)',
			);
			return [];
		}

		console.log(`📍 2GIS API нашел ${data.result.items.length} мест`);

		return data.result.items.map(item => {
			const basePlace = normalizePlace(item);
			const formattedDistance =
				typeof item.distance === 'number'
					? formatDistance(item.distance)
					: undefined;

			return {
				...basePlace,
				distance: formattedDistance,
			};
		});
	} catch (error) {
		console.error('❌ Error searching places:', error);
		return [];
	}
}

function mergeContactGroups(item: PlaceItem): ContactGroup[] | undefined {
	const direct = item.contact_groups ?? [];
	const fromLinks = extractContactsFromLinks(item.links);
	const combined = [...direct, ...fromLinks];

	if (!combined.length) {
		return undefined;
	}

	return combined
		.map(group => ({
			type: group.type,
			contacts: dedupeContacts(group.contacts ?? []),
		}))
		.filter(group => group.contacts.length > 0);
}

function extractContactsFromLinks(links?: PlaceLinks): ContactGroup[] {
	if (!links?.servicing?.items?.length) {
		return [];
	}

	const groups: ContactGroup[] = [];

	for (const servicingItem of links.servicing.items) {
		const contacts = servicingItem.contacts?.filter(Boolean) ?? [];
		if (!contacts.length) {
			continue;
		}

		groups.push({
			type: servicingItem.name ?? 'servicing',
			contacts,
		});
	}

	return groups;
}

function dedupeContacts(contacts: Contact[]): Contact[] {
	const seen = new Set<string>();
	const normalized: Contact[] = [];

	for (const contact of contacts) {
		const type = contact.type.trim();
		const value = contact.value.trim();
		const key = `${type.toLowerCase()}|${value.toLowerCase()}`;

		if (seen.has(key)) {
			continue;
		}

		seen.add(key);
		normalized.push({
			type,
			value,
			text: contact.text?.trim(),
		});
	}

	return normalized;
}

function normalizePlace(item: PlaceItem): Place {
	const contacts = mergeContactGroups(item);
	const reviews = item.reviews
		? [
				{
					id: '1',
					user_name: 'Mock User',
					rating: item.reviews.general_rating || 0,
					text: 'Mock review',
					date: formatISO(new Date()),
				},
			]
		: [];

	const reviewStats = item.reviews
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
		: undefined;

	return {
		id: item.id,
		name: resolvePlaceName(item),
		type: resolvePlaceType(item),
		address: composeAddress(item),
		point: item.point,
		contact_groups: contacts,
		schedule: item.schedule,
		reviews,
		review_stats: reviewStats,
		description: resolvePlaceDescription(item),
	};
}

function resolvePlaceName(item: PlaceItem) {
	return (
		item.name_ex?.primary?.trim() ||
		item.name_ex?.value?.trim() ||
		item.name.trim()
	);
}

function resolvePlaceType(item: PlaceItem) {
	const rubric = item.rubrics?.[0]?.name?.trim();
	const purpose = item.purpose_name?.trim();
	const short = item.name_ex?.short?.trim();

	return purpose || rubric || short || 'Место';
}

function resolvePlaceDescription(item: PlaceItem) {
	const description = item.name_ex?.value?.trim();
	if (
		description &&
		description !== item.name &&
		description !== item.name_ex?.primary
	) {
		return description;
	}
	return undefined;
}

function composeAddress(item: PlaceItem): Place['address'] {
	const components = item.address?.components ?? [];
	const admDiv = item.adm_div ?? [];

	const city =
		components.find(component => component.type === 'city')?.name ||
		admDiv.find(component => component.type === 'city')?.name ||
		admDiv.find(component => component.type === 'settlement')?.name;

	const street = components.find(component => component.type === 'street');
	const house = components.find(
		component =>
			component.type === 'building' || component.type === 'house',
	);

	const houseNumber =
		house?.number || house?.name || components.find(c => c.number)?.number;

	const shortParts = [street?.name, houseNumber].filter(Boolean);

	return {
		name:
			item.address_name ||
			item.full_address_name ||
			shortParts.join(', ') ||
			'',
		full_name: item.full_address_name || item.address_name,
		building_name: item.building_name,
		city: city ?? undefined,
		street: street?.name ?? undefined,
		house_number: houseNumber ?? undefined,
		short_address: shortParts.length ? shortParts.join(', ') : undefined,
	};
}

function formatDistance(distanceMeters: number) {
	if (Number.isNaN(distanceMeters) || distanceMeters <= 0) {
		return undefined;
	}

	if (distanceMeters < 1000) {
		return `${Math.round(distanceMeters)} м`;
	}

	const kilometers = distanceMeters / 1000;
	return `${kilometers.toFixed(kilometers >= 10 ? 0 : 1)} км`;
}
