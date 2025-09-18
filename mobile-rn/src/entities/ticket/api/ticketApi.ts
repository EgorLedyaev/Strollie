import type { Ticket } from '../model';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const qrUrl = (id: string) =>
	`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
		`ticket:${id}`,
	)}`;

export const ticketApi = {
	async getMyTickets(): Promise<Ticket[]> {
		// имитация сети
		await sleep(500);

		const now = new Date();

		return [];
	},

	/**
	 * Создание пользовательского билета (мокаем без backend)
	 */
	async createCustomTicket(data: {
		title: string;
		date: string; // ISO
		imageUri?: string | null;
		fileName?: string | null;
		businessCategory: 'transport' | 'entertainment';
	}): Promise<Ticket> {
		await sleep(300);
		const id = `custom_${Date.now()}`;
		return {
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
	},
};
