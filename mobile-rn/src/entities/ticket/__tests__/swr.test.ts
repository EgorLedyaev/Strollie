import { mockTicketRepo } from '../api/mockTicketRepo';
import { ticketApi } from '../api/ticketApi';
import type { Ticket } from '../model';

jest.mock('../api/mockTicketRepo');
const repo = mockTicketRepo as jest.Mocked<typeof mockTicketRepo>;

function ticket(id: string): Ticket {
	return {
		id,
		from: 'A',
		to: 'B',
		departureTime: new Date().toISOString(),
		arrivalTime: new Date().toISOString(),
		isUsed: false,
		type: 'train',
		businessCategory: 'transport',
		title: id,
	} as Ticket;
}

describe('ticketApi.getMyTicketsSWR', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns snapshot immediately when present & fresh', async () => {
		repo.meta.mockResolvedValue({ lastSync: Date.now(), version: 1 });
		repo.list.mockResolvedValue({
			items: [ticket('1')],
			lastSync: Date.now(),
		});

		const onUpdate = jest.fn();
		const result = await ticketApi.getMyTicketsSWR({
			ttlMs: 10_000,
			onUpdate,
		});
		expect(result.map(t => t.id)).toEqual(['1']);
		// no background second call because not stale
		expect(repo.list).toHaveBeenCalledTimes(1);
		expect(onUpdate).not.toHaveBeenCalled();
	});

	it('returns stale snapshot then triggers background refresh', async () => {
		const staleTime = Date.now() - 60_000;
		// first immediate snapshot call (simulateNetwork false)
		repo.meta.mockResolvedValue({ lastSync: staleTime, version: 1 });
		// For immediate snapshot
		repo.list.mockResolvedValueOnce({
			items: [ticket('old')],
			lastSync: staleTime,
		});
		// For background refresh
		repo.list.mockResolvedValueOnce({
			items: [ticket('old'), ticket('new')],
			lastSync: Date.now(),
		});

		const onUpdate = jest.fn();
		const result = await ticketApi.getMyTicketsSWR({
			ttlMs: 1000,
			onUpdate,
		});
		expect(result.map(t => t.id)).toEqual(['old']);

		// Allow microtasks to flush
		await Promise.resolve();

		expect(onUpdate).toHaveBeenCalledTimes(1);
		expect(onUpdate.mock.calls[0][0].map((t: Ticket) => t.id)).toEqual([
			'old',
			'new',
		]);
		expect(repo.list).toHaveBeenCalledTimes(2);
	});

	it('falls back to blocking fetch if no snapshot', async () => {
		repo.meta.mockResolvedValue({ lastSync: 0, version: 1 });
		// snapshot (empty)
		repo.list.mockResolvedValueOnce({ items: [], lastSync: 0 });
		// blocking fetch
		repo.list.mockResolvedValueOnce({
			items: [ticket('x')],
			lastSync: Date.now(),
		});

		const res = await ticketApi.getMyTicketsSWR({ ttlMs: 1000 });
		expect(res.map(t => t.id)).toEqual(['x']);
		expect(repo.list).toHaveBeenCalledTimes(2);
	});
});
