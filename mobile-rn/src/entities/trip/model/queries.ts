import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatISO } from 'date-fns';

import { tripsKeys } from '@/shared/api';

import {
	tripApi,
	type CreateTripInput,
	type UpdateTripInput,
} from '../api/tripApi';
import type { Trip } from './trip.model';

export function useTripsQuery() {
	return useQuery({
		queryKey: tripsKeys.all,
		queryFn: () => tripApi.getMyTrips(),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
}

export function useTripDetailsQuery(tripId: string) {
	const queryClient = useQueryClient();

	return useQuery({
		queryKey: tripsKeys.byId(tripId),
		queryFn: async () => {
			// Since we don't have a direct getById endpoint, we fetch all and find
			// In a real app, this would be a direct API call
			const trips = await tripApi.getMyTrips();
			const trip = trips.find(t => t.id === tripId);
			if (!trip) throw new Error('Trip not found');
			return trip;
		},
		initialData: () => {
			// Try to find the trip in the list cache for instant load
			const trips = queryClient.getQueryData<Trip[]>(tripsKeys.all);
			return trips?.find(t => t.id === tripId);
		},
	});
}

export function useCreateTripMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateTripInput) => tripApi.createTrip(data),
		onMutate: async newTripData => {
			await queryClient.cancelQueries({ queryKey: tripsKeys.all });

			const previousTrips = queryClient.getQueryData<Trip[]>(
				tripsKeys.all,
			);

			const optimisticTrip: Trip = {
				id: `temp_${Date.now()}`,
				createdAt: formatISO(new Date()),
				updatedAt: formatISO(new Date()),
				...newTripData,
				// Provide defaults for optional fields if missing
				notes: newTripData.notes ?? '',
				title: newTripData.title ?? 'Новая поездка',
			};

			if (previousTrips) {
				queryClient.setQueryData<Trip[]>(tripsKeys.all, old => [
					...(old || []),
					optimisticTrip,
				]);
			}

			return { previousTrips };
		},
		onError: (_err, _newTrip, context) => {
			if (context?.previousTrips) {
				queryClient.setQueryData(tripsKeys.all, context.previousTrips);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: tripsKeys.all });
		},
	});
}

export function useUpdateTripMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateTripInput }) =>
			tripApi.updateTrip(id, data),
		onMutate: async ({ id, data }) => {
			await queryClient.cancelQueries({ queryKey: tripsKeys.all });
			await queryClient.cancelQueries({ queryKey: tripsKeys.byId(id) });

			const previousTrips = queryClient.getQueryData<Trip[]>(
				tripsKeys.all,
			);
			const previousTripDetails = queryClient.getQueryData<Trip>(
				tripsKeys.byId(id),
			);

			// Optimistic update for list
			if (previousTrips) {
				queryClient.setQueryData<Trip[]>(tripsKeys.all, old =>
					old?.map(trip =>
						trip.id === id
							? {
									...trip,
									...data,
									updatedAt: formatISO(new Date()),
								}
							: trip,
					),
				);
			}

			// Optimistic update for details
			if (previousTripDetails) {
				queryClient.setQueryData<Trip>(tripsKeys.byId(id), old =>
					old
						? {
								...old,
								...data,
								updatedAt: formatISO(new Date()),
							}
						: old,
				);
			}

			return { previousTrips, previousTripDetails };
		},
		onError: (_err, { id }, context) => {
			if (context?.previousTrips) {
				queryClient.setQueryData(tripsKeys.all, context.previousTrips);
			}
			if (context?.previousTripDetails) {
				queryClient.setQueryData(
					tripsKeys.byId(id),
					context.previousTripDetails,
				);
			}
		},
		onSettled: (_data, _error, { id }) => {
			queryClient.invalidateQueries({ queryKey: tripsKeys.all });
			queryClient.invalidateQueries({ queryKey: tripsKeys.byId(id) });
		},
	});
}

export function useDeleteTripMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => tripApi.deleteTrip(id),
		onMutate: async id => {
			await queryClient.cancelQueries({ queryKey: tripsKeys.all });

			const previousTrips = queryClient.getQueryData<Trip[]>(
				tripsKeys.all,
			);

			if (previousTrips) {
				queryClient.setQueryData<Trip[]>(tripsKeys.all, old =>
					old?.filter(trip => trip.id !== id),
				);
			}

			return { previousTrips };
		},
		onError: (_err, _id, context) => {
			if (context?.previousTrips) {
				queryClient.setQueryData(tripsKeys.all, context.previousTrips);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: tripsKeys.all });
		},
	});
}
