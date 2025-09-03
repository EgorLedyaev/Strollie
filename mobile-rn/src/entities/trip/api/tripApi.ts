import type { Trip, TripChecklistItem } from '../model/trip.model';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

// In-memory dataset (can be swapped with real backend service)
const trips: Trip[] = [
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

export const tripApi = {
  async createTrip(data: CreateTripInput): Promise<Trip> {
    await sleep(400);
    const now = new Date().toISOString();
    const trip: Trip = {
      id: `trip_${Math.random().toString(36).slice(2, 10)}`,
      createdAt: now,
      updatedAt: now,
      ...data,
    };
    trips.push(trip);
    return trip;
  },
  async listTrips(): Promise<Trip[]> {
    await sleep(200);
    return [...trips];
  },
};

export type { Trip };
