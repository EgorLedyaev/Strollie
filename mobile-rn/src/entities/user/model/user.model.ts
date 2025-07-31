export interface User {
	user_id: string;
	email: string;
	created_at: string;
	firstName?: string;
	lastName?: string;
	middleName?: string;
	nickname?: string;
	city?: string;
	birthDate?: string;
	aboutMe?: string;

	// Дополнительные поля для совместимости
	photo?: string;
	name?: string; // Alias для firstName
	surname?: string; // Alias для lastName
}
