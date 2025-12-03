import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Ticket } from '../model';

const STORAGE_KEY = 'tickets_v1';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Read all tickets from AsyncStorage.
 */
async function readTickets(): Promise<Ticket[]> {
	const raw = await AsyncStorage.getItem(STORAGE_KEY);
	if (!raw) return [];
	try {
		return JSON.parse(raw) as Ticket[];
	} catch {
		return [];
	}
}

/**
 * Write all tickets to AsyncStorage.
 */
async function writeTickets(tickets: Ticket[]): Promise<void> {
	await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

/**
 * [MOCK] Ticket API for development.
 * In production, these will be replaced with real API calls.
 */
export const ticketApi = {
	/**
	 * Fetch all user tickets.
	 * Mock: reads from AsyncStorage with simulated network delay.
	 */
	async getMyTickets(): Promise<Ticket[]> {
		await sleep(300); // Simulate network delay
		const tickets = await readTickets();
		console.log(`[MOCK API] Loaded ${tickets.length} tickets`);
		return tickets;
	},

	/**
	 * Create a custom ticket.
	 * Mock: saves to AsyncStorage with simulated network delay.
	 */
	async createCustomTicket(data: {
		title: string;
		date: string; // ISO
		imageUri?: string | null;
		fileName?: string | null;
		businessCategory: 'transport' | 'entertainment';
	}): Promise<Ticket> {
		await sleep(150); // Simulate network delay

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

		const tickets = await readTickets();
		tickets.push(ticket);
		await writeTickets(tickets);

		console.log(`[MOCK API] Created ticket ${id}`);
		return ticket;
	},

	/**
	 * Delete a ticket by ID.
	 * Mock: removes from AsyncStorage.
	 */
	async deleteTicket(id: string): Promise<void> {
		await sleep(100);

		const tickets = await readTickets();
		const filtered = tickets.filter(t => t.id !== id);
		await writeTickets(filtered);

		console.log(`[MOCK API] Deleted ticket ${id}`);
	},

	/**
	 * Update a ticket.
	 * Mock: updates in AsyncStorage.
	 */
	async updateTicket(
		id: string,
		data: Partial<Omit<Ticket, 'id'>>,
	): Promise<Ticket> {
		await sleep(150);

		const tickets = await readTickets();
		const index = tickets.findIndex(t => t.id === id);

		if (index === -1) {
			throw new Error(`Ticket ${id} not found`);
		}

		const updated = { ...tickets[index], ...data };
		tickets[index] = updated;
		await writeTickets(tickets);

		console.log(`[MOCK API] Updated ticket ${id}`);
		return updated;
	},
};
