import { z } from 'zod';

export const tripCreateSchema = z.object({
	startDate: z.string().min(1, 'Выберите дату начала'),
	endDate: z.string().min(1, 'Выберите дату окончания'),
	selectedTickets: z.array(z.any()).optional(), // Уточнить тип билета, если возможно
	places: z.array(z.any()).optional(),
	routes: z.array(z.any()).optional(),
	checklist: z
		.array(
			z.object({
				id: z.string(),
				text: z.string(),
				done: z.boolean(),
			}),
		)
		.optional(),
	notes: z.string().optional(),
});

export type TripCreateSchema = z.infer<typeof tripCreateSchema>;
