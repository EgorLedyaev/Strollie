import { z } from 'zod';

export const profileSchema = z.object({
	firstName: z.string().min(1, 'Введите имя'),
	lastName: z.string().min(1, 'Введите фамилию'),
	nickname: z.string().min(1, 'Введите никнейм'),
	email: z.string().email('Некорректный email'),
	city: z.string().min(1, 'Выберите город'),
	birthDate: z
		.string()
		.min(1, 'Введите дату рождения')
		.regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Формат даты: ДД.ММ.ГГГГ'),
	photo: z.string().optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
