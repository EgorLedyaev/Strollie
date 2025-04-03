export const KEYCLOAK_CONFIG = {
	url: process.env.EXPO_PUBLIC_KEYCLOAK_URL || 'https://strollie.ru:8443',
	realm: process.env.EXPO_PUBLIC_KEYCLOAK_REALM || 'strollie',
	clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID || 'react-native-app',
	redirectUri: 'ru.strollie://redirect',
};
