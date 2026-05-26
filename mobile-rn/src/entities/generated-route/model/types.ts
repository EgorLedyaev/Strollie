/** Координаты точки (широта/долгота). */
export interface Coordinates {
	lat: number;
	lon: number;
}

/** Запрос на генерацию маршрута. */
export interface RouteGenerationRequest {
	/** Название города */
	city: string;
	/** Список категорий (по названию) */
	categories?: string[];
	/** Описание маршрута (пожелания пользователя) */
	description: string;
	/** Продолжительность в часах (целое значение) */
	durationHours: number;
	/** Начальная точка маршрута */
	startPoint: Coordinates;
}

/**
 * Точка интереса (POI) в маршруте.
 * Совпадает со схемой Place из OpenAPI.
 */
export interface Place {
	id: string;
	name: string;
	category: string;
	lat: number;
	lon: number;
	description?: string;
	address?: string;
	rating?: number;
	reviewCount?: number;
	workingHours?: string;
	openNow?: boolean;
	photoUrl?: string;
}

/** Успешный ответ POST /api/routes/generate */
export interface RouteGenerationResponse {
	places: Place[];
	directionsUrl: string;
	description?: string;
}

/** Нарушение валидации. */
export interface Violation {
	field: string;
	message: string;
}

/** Ответ об ошибке. */
export interface ErrorResponse {
	code: string;
	message: string;
	violations?: Violation[];
}
