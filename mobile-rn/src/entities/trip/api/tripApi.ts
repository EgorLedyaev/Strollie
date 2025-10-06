import type { Trip, TripChecklistItem } from '../model';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
export const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 минут

// In-memory dataset (can be swapped with real backend service)
const MOCK_TRIPS: Trip[] = [
	{
		id: 'trip_mock_future',
		title: 'Летняя поездка',
		startDate: '2025-06-18T00:00:00+04:00',
		endDate: '2025-06-24T23:59:59+04:00',
		ticketIds: [],
		places: [],
		routes: [],
		checklist: [],
		notes: '',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

export interface CreateTripInput {
	startDate: string;
	endDate: string;
	ticketIds: string[];
	places: string[];
	routes: string[];
	checklist: TripChecklistItem[];
	notes?: string;
	title?: string;
}

async function createTrip(data: CreateTripInput): Promise<Trip> {
	await sleep(400);
	const now = new Date().toISOString();
	const trip: Trip = {
		id: `trip_${Math.random().toString(36).slice(2, 10)}`,
		createdAt: now,
		updatedAt: now,
		...data,
	};
	MOCK_TRIPS.push(trip);
	return trip;
}

// export const tripApi = {
// 	async createTrip(data: CreateTripInput): Promise<Trip> {
// 		await sleep(400);
// 		const now = new Date().toISOString();
// 		const trip: Trip = {
// 			id: `trip_${Math.random().toString(36).slice(2, 10)}`,
// 			createdAt: now,
// 			updatedAt: now,
// 			...data,
// 		};
// 		trips.push(trip);
// 		return trip;
// 	},
// async listTrips(): Promise<Trip[]> {
// 	await sleep(200);
// 	return [...trips];
// },
// };

// export type { Trip };
const getMyTripsSWR = async (opts: {
	ttlMs: number;
	onUpdate: (fresh: Trip[]) => void;
}): Promise<void> => {
	// Имитация задержки сети
	await new Promise(resolve => setTimeout(resolve, 1500));
	opts.onUpdate([...MOCK_TRIPS]);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMyTrips = async (_opts: {
	force?: boolean;
	ttlMs: number;
}): Promise<Trip[]> => {
	await sleep(1200);
	// Также просто возвращаем текущее состояние
	return [...MOCK_TRIPS];
};
// const getMyTrips = async (_opts: {
// 	force?: boolean;
// 	ttlMs: number;
// }): Promise<Trip[]> => {
// 	await new Promise(resolve => setTimeout(resolve, 1200));
// 	return MOCK_TRIPS;
// };

export const tripApi = {
	getMyTrips,
	getMyTripsSWR,
	createTrip,
};
