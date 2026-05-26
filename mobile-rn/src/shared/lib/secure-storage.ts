import * as SecureStore from 'expo-secure-store';
import { createJSONStorage } from 'jotai/utils';

const secureStorage = {
	getItem: async (key: string): Promise<string | null> => {
		return SecureStore.getItemAsync(key);
	},
	setItem: async (key: string, value: string): Promise<void> => {
		return SecureStore.setItemAsync(key, value);
	},
	removeItem: async (key: string): Promise<void> => {
		return SecureStore.deleteItemAsync(key);
	},
};

export const secureAtomStorage = createJSONStorage(() => secureStorage);
