import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatISO } from 'date-fns';

import type { Trip, TripChecklistItem } from '../model';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
export const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 минут
const STORAGE_KEY = 'trips';

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
		createdAt: formatISO(new Date()),
		updatedAt: formatISO(new Date()),
	},
];

let memoryTrips: Trip[] | null = null;

async function persistTrips(trips: Trip[]) {
	try {
		const jsonValue = JSON.stringify(trips);
		await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
	} catch (e) {
		console.error('Ошибка сохранения поездок в AsyncStorage', e);
	}
}

async function loadTrips(): Promise<Trip[]> {
	try {
		const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
		if (jsonValue !== null) {
			return JSON.parse(jsonValue);
		}
		await persistTrips(MOCK_TRIPS);
		return MOCK_TRIPS;
	} catch (e) {
		console.error('Ошибка загрузки поездок из AsyncStorage', e);
		return MOCK_TRIPS;
	}
}

async function ensureTripsLoaded() {
	if (memoryTrips === null) {
		memoryTrips = await loadTrips();
	}
}

export interface UpdateTripInput {
	checklist: TripChecklistItem[];
	notes: string;
	ticketIds: string[];
	places: string[];
}

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
	const now = formatISO(new Date());
	const trip: Trip = {
		id: `trip_${Math.random().toString(36).slice(2, 10)}`,
		createdAt: now,
		updatedAt: now,
		...data,
	};
	memoryTrips!.push(trip);
	await persistTrips(memoryTrips!);
	return trip;
}

async function updateTrip(id: string, data: UpdateTripInput): Promise<Trip> {
	await sleep(300);
	const tripIndex = memoryTrips!.findIndex(t => t.id === id);

	if (tripIndex === -1) {
		throw new Error('Поездка не найдена');
	}

	const originalTrip = memoryTrips![tripIndex];
	const updatedTrip: Trip = {
		...originalTrip,
		...data,
		updatedAt: formatISO(new Date()),
	};
	memoryTrips![tripIndex] = updatedTrip;
	await persistTrips(memoryTrips!);
	return updatedTrip;
}

async function deleteTrip(id: string): Promise<void> {
	await sleep(400);
	const initialLength = memoryTrips!.length;
	memoryTrips = memoryTrips!.filter(t => t.id !== id);

	if (memoryTrips.length === initialLength) {
		throw new Error('Поездка для удаления не найдена');
	}

	await persistTrips(memoryTrips);
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

async function getMyTrips(opts?: { force?: boolean }): Promise<Trip[]> {
	await ensureTripsLoaded();
	if (opts?.force) {
		memoryTrips = await loadTrips();
	}
	await sleep(500);
	return [...memoryTrips!];
}
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
	updateTrip,
	deleteTrip,
};
