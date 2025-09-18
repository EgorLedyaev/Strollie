export interface TripChecklistItem {
	id: string;
	text: string;
	done: boolean;
}

export interface Trip {
	id: string;
	title?: string;
	startDate: string; // ISO date string
	endDate: string; // ISO date string
	ticketIds: string[];
	places: string[];
	routes: string[];
	checklist: TripChecklistItem[];
	notes?: string;
	createdAt: string; // ISO date string
	updatedAt: string; // ISO date string
}
export const DEFAULT_CHECKLIST_ITEMS: Omit<TripChecklistItem, 'id' | 'done'>[] =
	[
		{ text: 'Паспорт' },
		{ text: 'Билеты' },
		{ text: 'Страховка' },
		{ text: 'Бронь жилья' },
		{ text: 'Лекарства' },
	];
