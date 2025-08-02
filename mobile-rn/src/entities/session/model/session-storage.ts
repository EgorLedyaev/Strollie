import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Хранилище для управления сессией пользователя.
 * Содержит методы для сохранения, получения и удаления токена, email и других данных,
 * а также для проверки регистрации пользователя.
 */
export class SessionStorage {
	static readonly TOKEN_KEY = 'refresh_token';
	static readonly IS_REGISTRATION_KEY = 'is_registration';
	static readonly EMAIL_KEY = 'current_email';
	static readonly REGISTERED_USERS_KEY = 'registered_users';

	/**
	 * Сохраняет токен в хранилище.
	 * @param token Токен для сохранения в хранилище.
	 */
	static async setToken(token: string): Promise<void> {
		await AsyncStorage.setItem(this.TOKEN_KEY, token);
	}

	/**
	 * Получает токен из хранилища.
	 * @returns Токен или null, если токен не найден.
	 */
	static async getToken(): Promise<string | null> {
		return AsyncStorage.getItem(this.TOKEN_KEY);
	}

	/**
	 * Удаляет токен из хранилища.
	 */
	static async removeToken(): Promise<void> {
		await AsyncStorage.removeItem(this.TOKEN_KEY);
	}

	/**
	 * Сохраняет флаг регистрации в хранилище.
	 * @param isRegistration Флаг, указывающий, что пользователь находится в процессе регистрации.
	 */
	static async setIsRegistration(isRegistration: boolean): Promise<void> {
		await AsyncStorage.setItem(
			this.IS_REGISTRATION_KEY,
			String(isRegistration),
		);
	}

	/**
	 * Получает флаг регистрации из хранилища.
	 * @returns true, если пользователь находится в процессе регистрации, иначе false.
	 */
	static async getIsRegistration(): Promise<boolean> {
		const value = await AsyncStorage.getItem(this.IS_REGISTRATION_KEY);
		return value === 'true';
	}

	/**
	 * Удаляет флаг регистрации из хранилища.
	 */
	static async removeIsRegistration(): Promise<void> {
		await AsyncStorage.removeItem(this.IS_REGISTRATION_KEY);
	}

	/**
	 * Сохраняет email текущего пользователя в хранилище.
	 * @param email Email пользователя для сохранения.
	 */
	static async setEmail(email: string): Promise<void> {
		await AsyncStorage.setItem(this.EMAIL_KEY, email);
	}

	/**
	 * Получает email текущего пользователя из хранилища.
	 * @returns Email пользователя или null, если email не найден.
	 */
	static async getEmail(): Promise<string | null> {
		return AsyncStorage.getItem(this.EMAIL_KEY);
	}

	/**
	 * Удаляет email текущего пользователя из хранилища.
	 */
	static async removeEmail(): Promise<void> {
		await AsyncStorage.removeItem(this.EMAIL_KEY);
	}

	/**
	 * Добавляет email пользователя в список зарегистрированных.
	 * @param email Email пользователя для добавления.
	 */
	static async addRegisteredUser(email: string): Promise<void> {
		const registeredUsers = await this.getRegisteredUsers();
		if (!registeredUsers.includes(email)) {
			registeredUsers.push(email);
			await AsyncStorage.setItem(
				this.REGISTERED_USERS_KEY,
				JSON.stringify(registeredUsers),
			);
			console.log(
				'Пользователь добавлен в список зарегистрированных:',
				email,
			);
			console.log('Текущий список зарегистрированных:', registeredUsers);
		}
	}

	/**
	 * Получает список зарегистрированных пользователей.
	 * @returns Массив email зарегистрированных пользователей.
	 */
	static async getRegisteredUsers(): Promise<string[]> {
		const value = await AsyncStorage.getItem(this.REGISTERED_USERS_KEY);
		const users = value ? JSON.parse(value) : [];
		console.log(
			'Восстановлен список зарегистрированных пользователей из хранилища:',
			users,
		);
		return users;
	}

	/**
	 * Проверяет, зарегистрирован ли пользователь по email.
	 * @param email - Email пользователя для проверки регистрации.
	 * @returns true, если пользователь зарегистрирован, иначе false.
	 */
	static async isUserRegistered(email: string): Promise<boolean> {
		const registeredUsers = await this.getRegisteredUsers();
		const isRegistered = registeredUsers.includes(email);
		console.log('Проверка регистрации для', email, ':', isRegistered);
		console.log(
			'Список зарегистрированных пользователей:',
			registeredUsers,
		);
		return isRegistered;
	}

	// Новый метод для сохранения профиля пользователя по email
	/**
	 * Сохраняет профиль пользователя по email.
	 * @param email - Email пользователя, для которого сохраняется профиль.
	 * @param profileData - Данные профиля пользователя.
	 */
	static async saveUserProfile(
		email: string,
		profileData: any,
	): Promise<void> {
		// Сохраняем профиль с префиксом email для уникальности
		const key = `user:profile:${email}`;
		await AsyncStorage.setItem(key, JSON.stringify(profileData));
		console.log(`Профиль пользователя ${email} сохранен в хранилище`);

		// Обновляем основной профиль для текущей сессии
		await AsyncStorage.setItem(
			'auth:userProfile',
			JSON.stringify(profileData),
		);
	}

	/**
	 * Загружает профиль пользователя по email.
	 * @param email - Email пользователя.
	 * @returns Профиль пользователя или null, если не найден.
	 */
	static async loadUserProfile(email: string): Promise<any | null> {
		const key = `user:profile:${email}`;
		const storedProfile = await AsyncStorage.getItem(key);
		if (storedProfile) {
			const profileData = JSON.parse(storedProfile);
			console.log(`Загружен профиль пользователя ${email}:`, profileData);

			// Обновляем основной профиль для текущей сессии
			await AsyncStorage.setItem(
				'auth:userProfile',
				JSON.stringify(profileData),
			);

			return profileData;
		}
		return null;
	}

	/**
	 * Удаляет все данные сессии.
	 * Используется при выходе из системы.
	 */
	static async clearAll(): Promise<void> {
		await AsyncStorage.multiRemove([
			this.TOKEN_KEY,
			this.IS_REGISTRATION_KEY,
			this.EMAIL_KEY,
			// Больше не удаляем список зарегистрированных пользователей при выходе из системы
			// this.REGISTERED_USERS_KEY
		]);
	}
}
