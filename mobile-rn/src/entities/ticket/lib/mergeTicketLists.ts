import type { Ticket } from '../model';

/**
 * Универсальный merge: входящие билеты поверх существующих (по id),
 * при совпадении — shallow merge (сохраняем локальные расширенные поля + обновляем пришедшие).
 */
export function mergeTicketLists(prev: Ticket[], incoming: Ticket[]): Ticket[] {
	if (!incoming.length) return prev.slice();
	const map = new Map<string, Ticket>();
	for (const t of prev) map.set(t.id, t);
	for (const t of incoming) map.set(t.id, { ...map.get(t.id), ...t });
	return Array.from(map.values());
}
