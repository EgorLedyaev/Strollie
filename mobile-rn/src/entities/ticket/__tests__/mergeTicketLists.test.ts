import { formatISO } from 'date-fns';

import { mergeTicketLists } from '../lib/mergeTicketLists';
import type { Ticket } from '../model';

function t(id: string, extra: Partial<Ticket> = {}): Ticket {
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
		...extra,
	} as Ticket;
}

describe('mergeTicketLists', () => {
	it('returns copy when incoming empty', () => {
		const base = [t('1'), t('2')];
		const merged = mergeTicketLists(base, []);
		expect(merged).toHaveLength(2);
		expect(merged).not.toBe(base); // новая ссылка
	});

	it('adds new tickets', () => {
		const base = [t('1')];
		const incoming = [t('2')];
		const merged = mergeTicketLists(base, incoming);
		expect(merged.map(x => x.id).sort()).toEqual(['1', '2']);
	});

	it('overwrites by id shallowly preserving existing fields', () => {
		const base = [t('1', { title: 'orig', imageUri: 'local://image' })];
		const incoming = [t('1', { title: 'server', fileName: 'doc.pdf' })];
		const merged = mergeTicketLists(base, incoming);
		const item = merged.find(x => x.id === '1')!;
		expect(item.title).toBe('server'); // обновилось
		expect(item.imageUri).toBe('local://image'); // сохранилось
		expect(item.fileName).toBe('doc.pdf'); // добавилось
	});
});
