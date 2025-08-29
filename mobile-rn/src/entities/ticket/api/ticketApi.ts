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
		const y = now.getFullYear();

		const t1: Ticket = {
			id: 'tkt_cinema_322123133',
			from: 'Синема Парк',
			to: 'Несокрушимый',
			departureTime: `${y}-10-25T16:50:00+03:00`,
			arrivalTime: `${y}-10-25T19:00:00+03:00`,
			carrierInfo: { name: 'Синема Парк' }, // для обратной совместимости карточек
			address: 'ТРЦ Космопорт, Московское шоссе 17',
			qrCodeUrl: qrUrl('tkt_cinema_322123133'),
			type: 'other',
			isUsed: false,
			hall: '1',
			row: '10',
			seat: '23',
		};

		const t2: Ticket = {
			id: 'tkt_train_samara_saratov',
			from: 'Самара',
			to: 'Саратов',
			departureTime: `${y}-10-26T12:54:00+04:00`,
			arrivalTime: `${y}-10-27T13:41:00+04:00`,
			carrierInfo: { name: 'РЖД', flight: '073Ж' },
			qrCodeUrl: qrUrl('tkt_train_samara_saratov'),
			type: 'train',
			isUsed: false,
			seat: '23',
		};

		const t3: Ticket = {
			id: 'tkt_plane_mow_sochi',
			from: 'Москва',
			to: 'Сочи',
			departureTime: `${y}-08-30T09:30:00+03:00`,
			arrivalTime: `${y}-08-30T11:35:00+03:00`,
			carrierInfo: { name: 'S7 Airlines', flight: 'S7-1123' },
			qrCodeUrl: qrUrl('tkt_plane_mow_sochi'),
			type: 'plane',
			isUsed: false,
			seat: '12A',
		};

		return [t1, t2, t3];
	},
};
