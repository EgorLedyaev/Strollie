// Общие типы для пользователя
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
}
