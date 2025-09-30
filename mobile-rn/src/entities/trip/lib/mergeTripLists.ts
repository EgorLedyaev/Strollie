import type { Trip } from '../model';

/**
 * Сливает два списка поездок.
 * Новые поездки добавляются, существующие (по id) обновляются.
 */
export function mergeTripLists(base: Trip[], incoming: Trip[]): Trip[] {
	const map = new Map<string, Trip>();

	// Сначала добавляем все базовые поездки
	for (const trip of base) {
		map.set(trip.id, trip);
	}

	// Затем обновляем/добавляем пришедшие
	for (const trip of incoming) {
		map.set(trip.id, trip);
	}

	return Array.from(map.values());
}
