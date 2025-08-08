import type { Trip } from '../model';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export const tripApi = {
  async getMyTrips(): Promise<Trip[]> {
    await sleep(300);

    // Две готовые поездки, синхронизированные с билетами
    return [
      {
        id: 'trip_saratov',
        name: 'Поездка в Саратов',
        startDate: new Date('2025-06-18T00:00:00+04:00'),
        endDate: new Date('2025-06-24T23:59:59+04:00'),
        ticketIds: ['tkt_train_samara_saratov'],
        routeIds: [],
        checklistItems: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'trip_february',
        name: 'Название поездки',
        startDate: new Date('2025-02-18T00:00:00+03:00'),
        endDate: new Date('2025-02-24T23:59:59+03:00'),
        ticketIds: ['tkt_plane_mow_sochi'],
        routeIds: [],
        checklistItems: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  },
};
