
 /**
  * Интерфейс для представления пользователя.
  * Содержит основные поля профиля пользователя.
  * Используется для хранения и передачи данных пользователя в приложении.
  * @property {string} user_id - Уникальный идентификатор пользователя.
  * @property {string} email - Email пользователя.
  * @property {string} created_at - Дата и время создания профиля.
  * @property {string} [firstName] - Имя пользователя (необязательное).
  * @property {string} [lastName] - Фамилия пользователя (необязательное).
  * @property {string} [nickname] - Никнейм пользователя (необязательное).
  * @property {string} [city] - Город пользователя (необязательное).
  * @property {string} [birthDate] - Дата рождения (необязательное).
  * @property {string} [photo] - URL фотографии пользователя (необязательное).
  */
export interface User {
	user_id: string;
	email: string;
	created_at: string;
	firstName?: string;
	lastName?: string;
	nickname?: string;
	city?: string;
	birthDate?: string;
	photo?: string;
}
