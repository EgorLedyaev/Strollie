export type EventType = 'excursion' | 'ticket' | 'activity';

export interface Event {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  tags: string[];
  price?: number;
  currency?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  tripId?: string; // ID поездки, к которой привязано событие
}
