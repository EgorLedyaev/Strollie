import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInfo } from './auth-context';
import { User } from '@/src/entities/user/model/user.model';

const TOKEN_KEY = 'auth:tokens';
const USER_INFO_KEY = 'auth:userInfo';
const USER_PROFILE_KEY = 'auth:userProfile';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const AuthStorage = {
  // Работа с токенами
  async saveTokens(tokens: AuthTokens): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  },
  
  async getTokens(): Promise<AuthTokens | null> {
    const tokensString = await AsyncStorage.getItem(TOKEN_KEY);
    if (!tokensString) return null;
    return JSON.parse(tokensString);
  },
  
  async clearTokens(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  // Работа с информацией пользователя
  async saveUserInfo(userInfo: UserInfo): Promise<void> {
    await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  },
  
  async getUserInfo(): Promise<UserInfo | null> {
    const userInfoString = await AsyncStorage.getItem(USER_INFO_KEY);
    if (!userInfoString) return null;
    return JSON.parse(userInfoString);
  },
  
  async clearUserInfo(): Promise<void> {
    await AsyncStorage.removeItem(USER_INFO_KEY);
  },

  // Работа с профилем пользователя
  async saveUserProfile(profile: User): Promise<void> {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  },
  
  async getUserProfile(): Promise<User | null> {
    const profileString = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (!profileString) return null;
    return JSON.parse(profileString);
  },
  
  async clearUserProfile(): Promise<void> {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
  },
  
  // Полная очистка при выходе
  async clearAll(): Promise<void> {
    const keysToRemove = [
      TOKEN_KEY,
      USER_INFO_KEY, 
      USER_PROFILE_KEY,
      'temp_email',
      'is_registration'
    ];
    await AsyncStorage.multiRemove(keysToRemove);
    console.log('Все данные аутентификации очищены');
  }
};
