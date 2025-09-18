import { useAtom } from 'jotai';

import { EventType, eventTypeFilterAtom } from '@/entities/event';

export const useCalendarFilter = () => {
	const [activeFilter, setActiveFilter] = useAtom(eventTypeFilterAtom);

	const setFilter = (type: EventType | 'all') => {
		setActiveFilter(type);
	};

	return {
		activeFilter,
		setFilter,
	};
};
