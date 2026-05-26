import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ticketsKeys } from '@/shared/api';

import { ticketApi } from '../api/ticketApi';
import type { Ticket } from './ticket.model';

const LOG_TAG = '[tickets/queries]';

async function fetchTickets(): Promise<Ticket[]> {
	console.log(LOG_TAG, 'fetchTickets: starting request via ticketApi...');
	try {
		const data = await ticketApi.getMyTickets();
		console.log(
			LOG_TAG,
			'fetchTickets: success, count =',
			data?.length ?? 0,
		);
		return data;
	} catch (error) {
		console.error(LOG_TAG, 'fetchTickets: error', error);
		throw error;
	}
}

export function useTicketsQuery() {
	console.log(LOG_TAG, 'useTicketsQuery: hook called');
	const query = useQuery({
		queryKey: ticketsKeys.all,
		queryFn: fetchTickets,
	});
	console.log(
		LOG_TAG,
		'useTicketsQuery: status =',
		query.status,
		', isLoading =',
		query.isLoading,
		', isPending =',
		query.isPending,
		', isFetching =',
		query.isFetching,
	);
	if (query.error) {
		console.error(LOG_TAG, 'useTicketsQuery: error =', query.error);
	}
	return query;
}

type CreateCustomTicketInput = Parameters<
	typeof ticketApi.createCustomTicket
>[0];

export function useAddTicketMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateCustomTicketInput) =>
			ticketApi.createCustomTicket(data),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ticketsKeys.all });

			const previousTickets = queryClient.getQueryData<Ticket[]>(
				ticketsKeys.all,
			);

			return { previousTickets };
		},
		onError: (_err, _newTicket, context) => {
			if (context?.previousTickets) {
				queryClient.setQueryData(
					ticketsKeys.all,
					context.previousTickets,
				);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ticketsKeys.all });
		},
	});
}
