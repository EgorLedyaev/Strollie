import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { TicketDetailsPage } from '@/pages/tickets';

export default function Page() {
	const params = useLocalSearchParams<{ id?: string }>();
	const id = typeof params.id === 'string' ? params.id : undefined;
	if (!id) return null;
	return <TicketDetailsPage ticketId={id} />;
}
