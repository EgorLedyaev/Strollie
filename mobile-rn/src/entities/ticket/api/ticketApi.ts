import type { Ticket } from '../model';
import { mockTicketRepo } from './mockTicketRepo';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms)); // может пригодиться дальше

// TTL в миллисекундах: если lastSync свежее этого порога — повторный сетевой/mock вызов можно пропустить.
export const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 минут

export const ticketApi = {
	/**
	 * Получить билеты (mock) с учётом кэша lastSync.
	 * @param opts.force - игнорировать TTL и форсировать обращение к репо
	 * @param opts.ttlMs - переопределить TTL
	 */
	async getMyTickets(
		opts: { force?: boolean; ttlMs?: number } = {},
	): Promise<Ticket[]> {
		const { force = false, ttlMs = DEFAULT_TTL_MS } = opts;
		// Читаем метаданные чтобы понять свежесть
		if (!force) {
			try {
				const meta = await mockTicketRepo.meta();
				if (Date.now() - meta.lastSync < ttlMs) {
					// Данные свежие: возвращаем локальный snapshot без симуляции сети
					const { items } = await mockTicketRepo.list({
						simulateNetwork: false,
					});
					return items;
				}
			} catch {
				// молча продолжаем — fallback к обычному пути
			}
		}
		// Выполняем "сетевой" (симулированный) вызов
		const { items } = await mockTicketRepo.list();
		return items;
	},
	/**
	 * SWR-вариант: мгновенно возвращает (стейл) локальные данные, если они свежие по TTL,
	 * и параллельно (если устарели) триггерит фоновое обновление через onUpdate.
	 * Если данных нет вообще — ждём первый fetch (behaves like getMyTickets).
	 */
	async getMyTicketsSWR(
		opts: {
			onUpdate?: (fresh: Ticket[]) => void | Promise<void>;
			ttlMs?: number;
		} = {},
	): Promise<Ticket[]> {
		const { onUpdate, ttlMs = DEFAULT_TTL_MS } = opts;
		// Сначала читаем локально без сети
		let meta;
		try {
			meta = await mockTicketRepo.meta();
		} catch {
			/* ignore */
		}
		const { items: snapshot } = await mockTicketRepo.list({
			simulateNetwork: false,
		});
		const age = meta ? Date.now() - meta.lastSync : Infinity;
		const stale = age >= ttlMs;
		// Если нет данных вообще — делаем обычный fetch (блокирующий)
		if (snapshot.length === 0) {
			const { items } = await mockTicketRepo.list();
			return items;
		}
		// Если данные есть и не устарели — просто возвращаем
		if (!stale) return snapshot;
		// Возвращаем стейл сразу, а обновление пробуем в фоне
		mockTicketRepo.list().then(({ items }) => {
			if (onUpdate) {
				try {
					onUpdate(items);
				} catch {
					/* ignore */
				}
			}
		});
		return snapshot;
	},
	/** Создание пользовательского билета (мок без backend). */
	async createCustomTicket(data: {
		title: string;
		date: string; // ISO
		imageUri?: string | null;
		fileName?: string | null;
		businessCategory: 'transport' | 'entertainment';
	}): Promise<Ticket> {
		await sleep(120); // имитация небольшой задержки
		const id = `custom_${Date.now()}`;
		const ticket: Ticket = {
			id,
			from: data.title,
			to: data.title,
			departureTime: data.date,
			arrivalTime: data.date,
			isUsed: false,
			type: data.businessCategory === 'transport' ? 'train' : 'other',
			businessCategory: data.businessCategory,
			title: data.title,
			imageUri: data.imageUri ?? undefined,
			fileName: data.fileName ?? undefined,
		};
		await mockTicketRepo.create(ticket);
		return ticket;
	},
};
