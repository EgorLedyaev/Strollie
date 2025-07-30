import AsyncStorage from '@react-native-async-storage/async-storage';

// Перенесено и переименовано из AuthStorage
export class SessionStorage {
  static readonly TOKEN_KEY = 'refresh_token';
  static readonly IS_REGISTRATION_KEY = 'is_registration';

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
    await AsyncStorage.setItem(this.IS_REGISTRATION_KEY, String(isRegistration));
  }

  static async getIsRegistration(): Promise<boolean> {
    const value = await AsyncStorage.getItem(this.IS_REGISTRATION_KEY);
    return value === 'true';
  }

  static async removeIsRegistration(): Promise<void> {
    await AsyncStorage.removeItem(this.IS_REGISTRATION_KEY);
  }

  static async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([this.TOKEN_KEY, this.IS_REGISTRATION_KEY]);
  }
}
