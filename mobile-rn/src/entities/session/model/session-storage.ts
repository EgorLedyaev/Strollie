import AsyncStorage from '@react-native-async-storage/async-storage';

// Перенесено и переименовано из AuthStorage
export class SessionStorage {
	static readonly TOKEN_KEY = 'refresh_token';
	static readonly IS_REGISTRATION_KEY = 'is_registration';
	static readonly EMAIL_KEY = 'current_email';
	static readonly REGISTERED_USERS_KEY = 'registered_users';

	static async setToken(token: string): Promise<void> {
		await AsyncStorage.setItem(this.TOKEN_KEY, token);
	}

	static async getToken(): Promise<string | null> {
		return AsyncStorage.getItem(this.TOKEN_KEY);
	}

	static async removeToken(): Promise<void> {
		await AsyncStorage.removeItem(this.TOKEN_KEY);
	}

	static async setIsRegistration(isRegistration: boolean): Promise<void> {
		await AsyncStorage.setItem(
			this.IS_REGISTRATION_KEY,
			String(isRegistration),
		);
	}

	static async getIsRegistration(): Promise<boolean> {
		const value = await AsyncStorage.getItem(this.IS_REGISTRATION_KEY);
		return value === 'true';
	}

	static async removeIsRegistration(): Promise<void> {
		await AsyncStorage.removeItem(this.IS_REGISTRATION_KEY);
	}

	static async setEmail(email: string): Promise<void> {
		await AsyncStorage.setItem(this.EMAIL_KEY, email);
	}

	static async getEmail(): Promise<string | null> {
		return AsyncStorage.getItem(this.EMAIL_KEY);
	}

	static async removeEmail(): Promise<void> {
		await AsyncStorage.removeItem(this.EMAIL_KEY);
	}

	// Методы для работы с зарегистрированными пользователями
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

	static async getRegisteredUsers(): Promise<string[]> {
		const value = await AsyncStorage.getItem(this.REGISTERED_USERS_KEY);
		const users = value ? JSON.parse(value) : [];
		console.log(
			'Восстановлен список зарегистрированных пользователей из хранилища:',
			users,
		);
		return users;
	}

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

	// Новый метод для загрузки профиля пользователя по email
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
