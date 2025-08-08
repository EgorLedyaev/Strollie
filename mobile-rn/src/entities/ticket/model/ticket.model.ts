export type TicketType = 'plane' | 'train' | 'bus' | 'other';

export interface Ticket {
  id: string;
  qrCodeUrl?: string;
  from: string;
  to: string;
  departureTime: string; // ISO string
  arrivalTime: string; // ISO string
  seat?: string;
  row?: string; // ряд (для кино/поезда)
  hall?: string; // зал (для кино)
  carrierInfo?: {
    name: string;
    logo?: string;
    flight?: string; // Номер рейса/поезда
  };
  price?: number;
  currency?: string;
  type: TicketType;
  isUsed: boolean;
  tripId?: string; // ID поездки, к которой привязан билет
}
