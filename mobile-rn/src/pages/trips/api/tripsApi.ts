const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export interface TripItemApi {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  ticketIds: string[];
}

export const tripsApi = {
  async getMyTrips(): Promise<TripItemApi[]> {
    await sleep(200);

    // Две готовые поездки из макета
    return [
      {
        id: 'trip_saratov',
        name: 'Поездка в Саратов',
        startDate: new Date('2025-06-18T00:00:00+04:00'),
        endDate: new Date('2025-06-24T23:59:59+04:00'),
        ticketIds: ['tkt_train_samara_saratov'],
      },
      {
        id: 'trip_february',
        name: 'Название поездки',
        startDate: new Date('2025-02-18T00:00:00+03:00'),
        endDate: new Date('2025-02-24T23:59:59+03:00'),
        ticketIds: ['tkt_plane_mow_sochi'],
      },
    ];
  },
};
