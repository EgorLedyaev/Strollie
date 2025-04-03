import { KEYCLOAK_CONFIG } from '@/entities/auth/config';
import { API_URL } from '@/shared/config/api';

export const AUTH_ENDPOINTS = {
	login: `${API_URL}/auth/login`,
	logout: `${API_URL}/auth/logout`,
	refresh: `${API_URL}/auth/refresh`,
};

export const KEYCLOAK_ENDPOINTS = {
	token: (realm: string) =>
		`${KEYCLOAK_CONFIG.url}/realms/${realm}/protocol/openid-connect/token`,
	auth: (realm: string) =>
		`${KEYCLOAK_CONFIG.url}/realms/${realm}/protocol/openid-connect/auth`,
};
