import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Event, EventType } from './event.model';

// Хранит все события пользователя
export const eventsAtom = atomWithStorage<Event[]>('events', []);

// Текущий выбранный фильтр типов событий
export const eventTypeFilterAtom = atom<EventType | 'all'>('all');
