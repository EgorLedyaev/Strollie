import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Ticket } from '../model';

/**
 * Ключи в storage. Добавляем версию чтобы можно было мигрировать.
 */
const STORAGE_KEY = 'tickets_repo_v1';
const META_KEY = 'tickets_repo_meta_v1';

interface RepoMeta {
	lastSync: number; // unix ms
	version: 1;
}

const defaultMeta: RepoMeta = { lastSync: 0, version: 1 };

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function readAll(): Promise<Ticket[]> {
	const raw = await AsyncStorage.getItem(STORAGE_KEY);
	if (!raw) return [];
	try {
		return JSON.parse(raw) as Ticket[];
	} catch {
		return [];
	}
}

async function writeAll(list: Ticket[]) {
	await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

async function readMeta(): Promise<RepoMeta> {
	const raw = await AsyncStorage.getItem(META_KEY);
	if (!raw) return defaultMeta;
	try {
		return { ...defaultMeta, ...(JSON.parse(raw) as RepoMeta) };
	} catch {
		return defaultMeta;
	}
}

async function writeMeta(meta: Partial<RepoMeta>) {
	const prev = await readMeta();
	const next = { ...prev, ...meta } as RepoMeta;
	await AsyncStorage.setItem(META_KEY, JSON.stringify(next));
	return next;
}

function mergeTickets(existing: Ticket[], incoming: Ticket[]): Ticket[] {
	if (!incoming.length) return existing.slice();
	const map = new Map<string, Ticket>();
	for (const t of existing) map.set(t.id, t);
	for (const t of incoming) map.set(t.id, { ...map.get(t.id), ...t });
	return Array.from(map.values());
}

export const mockTicketRepo = {
	/** Имитация fetch списка. */
	async list({
		simulateNetwork = true,
	}: { simulateNetwork?: boolean } = {}): Promise<{
		items: Ticket[];
		lastSync: number;
	}> {
		if (simulateNetwork) await sleep(300); // latency
		const items = await readAll();
		const meta = await readMeta();
		return { items, lastSync: meta.lastSync };
	},
	/** Создание: добавляем и обновляем lastSync как локальное время. */
	async create(data: Ticket): Promise<Ticket> {
		await sleep(150);
		const all = await readAll();
		all.push(data);
		await writeAll(all);
		await writeMeta({ lastSync: Date.now() });
		return data;
	},
	async bulkMerge(incoming: Ticket[]): Promise<Ticket[]> {
		const current = await readAll();
		const merged = mergeTickets(current, incoming);
		const changed =
			merged.length !== current.length ||
			merged.some((m, i) => m !== current[i]);
		if (changed) {
			await writeAll(merged);
			await writeMeta({ lastSync: Date.now() });
		}
		return merged;
	},
	async meta(): Promise<RepoMeta> {
		return readMeta();
	},
	mergeTickets,
};

export type { RepoMeta };
