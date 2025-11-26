import { formatISO } from 'date-fns';

import { mockTicketRepo } from '../api/mockTicketRepo';
import { DEFAULT_TTL_MS, ticketApi } from '../api/ticketApi';
import type { Ticket } from '../model';

jest.mock('../api/mockTicketRepo');

function asMock<T extends object>(m: T): jest.Mocked<T> {
	return m as unknown as jest.Mocked<T>;
}

const mockRepo = asMock(mockTicketRepo);

function ticket(id: string): Ticket {
	return {
		id,
		from: 'A',
		to: 'B',
		departureTime: formatISO(new Date()),
		arrivalTime: formatISO(new Date()),
		isUsed: false,
		type: 'train',
		businessCategory: 'transport',
		title: id,
	} as Ticket;
}

describe('ticketApi.getMyTickets TTL', () => {
	beforeEach(() => {
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	it('returns fresh cache without network when within TTL', async () => {
		mockRepo.meta.mockResolvedValue({ lastSync: Date.now(), version: 1 });
		mockRepo.list.mockResolvedValue({
			items: [ticket('1')],
			lastSync: Date.now(),
		});

		const result = await ticketApi.getMyTickets({ ttlMs: 10_000 });
		expect(result).toHaveLength(1);
		// list called once with simulateNetwork:false (we mock list universally so we just assert single call)
		expect(mockRepo.list).toHaveBeenCalledTimes(1);
		expect(mockRepo.list.mock.calls[0][0]).toEqual({
			simulateNetwork: false,
		});
	});

	it('performs network fetch when stale', async () => {
		mockRepo.meta.mockResolvedValue({
			lastSync: Date.now() - DEFAULT_TTL_MS - 1,
			version: 1,
		});
		mockRepo.list.mockResolvedValue({
			items: [ticket('2')],
			lastSync: Date.now(),
		});

		const result = await ticketApi.getMyTickets();
		expect(result[0].id).toBe('2');
		expect(mockRepo.list).toHaveBeenCalledTimes(1); // simulateNetwork default true path
	});
});
