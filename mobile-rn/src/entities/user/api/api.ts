import AsyncStorage from '@react-native-async-storage/async-storage';

import { type User } from '../model/user.model';

/**
 * Генерирует ключ для хранения профиля пользователя в AsyncStorage. Внутренняя деталь.
 * Используется для хранения и извлечения профиля пользователя из AsyncStorage.
 * @param email - Email пользователя, для которого генерируется ключ профиля.
 * @returns Ключ профиля пользователя.
 */
const getUserProfileKey = (email: string): string => `user:profile:${email}`;

/**
 * [MOCK API] Проверяет, зарегистрирован ли пользователь.
 * В будущем: GET /api/v1/users/check?email=...
 * @param email - Email пользователя для проверки.
 * @returns true, если пользователь зарегистрирован, иначе false.
 */
const isUserRegistered = async (email: string): Promise<boolean> => {
	const key = getUserProfileKey(email);
	const profile = await AsyncStorage.getItem(key);
	console.log(`[MOCK API] Проверка регистрации для ${email}: ${!!profile}`);
	return profile !== null;
};

/**
 * [MOCK API] Сохраняет (создает или обновляет) профиль пользователя.
 * В будущем: POST /api/v1/users или PUT /api/v1/profile
 * @param profileData - Данные профиля пользователя.
 * @return Сохраненный профиль пользователя.
 */
const saveUserProfile = async (profileData: User): Promise<User> => {
	const key = getUserProfileKey(profileData.email);
	await AsyncStorage.setItem(key, JSON.stringify(profileData));
	console.log(`[MOCK API] Профиль для ${profileData.email} сохранен.`);
	return profileData;
};

/**
 * [MOCK API] Загружает профиль пользователя.
 * В будущем: GET /api/v1/profile
 * @param email - Email пользователя.
 * @returns Профиль пользователя или null, если не найден.
 */
const loadUserProfile = async (email: string): Promise<User | null> => {
	const key = getUserProfileKey(email);
	const storedProfile = await AsyncStorage.getItem(key);
	if (storedProfile) {
		const profileData = JSON.parse(storedProfile) as User;
		console.log(`[MOCK API] Загружен профиль для ${email}.`);
		return profileData;
	}
	console.warn(`[MOCK API] Профиль для ${email} не найден.`);
	return null;
};

/**
 * API для работы с профилем пользователя.
 * Содержит методы для проверки регистрации, сохранения и загрузки профиля.
 */
export const userApi = {
	isUserRegistered,
	saveUserProfile,
	loadUserProfile,
};
