export type TicketType = 'plane' | 'train' | 'bus' | 'other';

// Бизнес‑категория для фильтрации на новом экране
export type TicketBusinessCategory = 'transport' | 'entertainment';

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
  address?: string; // адрес площадки (для кино)
  // Кастомные поля для добавленных вручную билетов (новый UI)
  title?: string; // Пользовательское название (если не хотим дробить на from/to)
  imageUri?: string; // Локальный URI добавленного изображения билета
  fileName?: string; // Имя выбранного файла / изображения
  businessCategory?: TicketBusinessCategory; // 'transport' | 'entertainment'
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
