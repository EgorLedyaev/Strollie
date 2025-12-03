import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { axiosClient, ticketsKeys } from '@/shared/api';

import type { Ticket } from './ticket.model';

async function fetchTickets(): Promise<Ticket[]> {
	const { data } = await axiosClient.get<Ticket[]>('/tickets');
	return data;
}

async function createTicket(ticket: Omit<Ticket, 'id'>): Promise<Ticket> {
	const { data } = await axiosClient.post<Ticket>('/tickets', ticket);
	return data;
}

export function useTicketsQuery() {
	return useQuery({
		queryKey: ticketsKeys.all,
		queryFn: fetchTickets,
	});
}

export function useAddTicketMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createTicket,
		onMutate: async newTicket => {
			await queryClient.cancelQueries({ queryKey: ticketsKeys.all });

			const previousTickets = queryClient.getQueryData<Ticket[]>(
				ticketsKeys.all,
			);

			if (previousTickets) {
				queryClient.setQueryData<Ticket[]>(ticketsKeys.all, old => [
					...(old || []),
					{ ...newTicket, id: 'temp-id-' + Date.now() } as Ticket,
				]);
			}

			return { previousTickets };
		},
		onError: (err, newTicket, context) => {
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
