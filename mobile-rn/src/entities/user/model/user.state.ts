import { type User } from '@/src/shared/lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';
import { fetchUserProfile } from '../api/userApi';

export const profileAtom = atom<UserState>({
	profile: null,
	isLoading: false,
	error: null,
});

export const loadProfileAtom = atom(
	(get) => get(profileAtom),
	async (get, set) => {
		set(profileAtom, (prev) => ({ ...prev, isLoading: true, error: null }));
		try {
			// Сначала пытаемся загрузить из AsyncStorage
			const storedProfile = await AsyncStorage.getItem('auth:userProfile');
			if (storedProfile) {
				const profileData = JSON.parse(storedProfile);
				console.log('Loaded profile from storage', profileData);
				set(profileAtom, {
					isLoading: false,
					profile: profileData,
					error: null,
				});
				return;
			}

			// Если нет в хранилище - вызываем функцию из api
			const data = await fetchUserProfile();

			// Сохраняем в AsyncStorage
			await AsyncStorage.setItem('auth:userProfile', JSON.stringify(data));

			console.log('data from API', data);
			set(profileAtom, {
				isLoading: false,
				profile: data,
				error: null,
			});
		} catch (error) {
			console.error('Error loading profile', error);
			const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
			set(profileAtom, {
				isLoading: false,
				profile: null,
				error: errorMessage,
			});
		}
	},
);

export interface UserState {
	profile: User | null;
	isLoading: boolean;
	error: string | null;
}
