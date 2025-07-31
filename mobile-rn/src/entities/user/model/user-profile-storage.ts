import AsyncStorage from '@react-native-async-storage/async-storage';

import { User } from './user.model';

// Этот файл существует для поддержки совместимости во время миграции
// В будущем все функции должны быть перенесены в соответствующие модули
export class UserProfileStorage {
	private static readonly USER_PROFILE_KEY = 'auth:userProfile';

	static async getUserProfile(): Promise<Partial<User> | null> {
		try {
			const profileJson = await AsyncStorage.getItem(
				this.USER_PROFILE_KEY,
			);
			if (profileJson) {
				return JSON.parse(profileJson);
			}
			return null;
		} catch (error) {
			console.error('Ошибка при получении профиля пользователя', error);
			return null;
		}
	}

	static async saveUserProfile(profile: Partial<User>): Promise<void> {
		try {
			await AsyncStorage.setItem(
				this.USER_PROFILE_KEY,
				JSON.stringify(profile),
			);
		} catch (error) {
			console.error('Ошибка при сохранении профиля пользователя', error);
		}
	}
}
