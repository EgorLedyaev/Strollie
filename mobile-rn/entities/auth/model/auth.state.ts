import { API } from '@/entities/auth/api/api';
import {
	AuthResponse,
	LoginRequest,
} from '@/entities/auth/model/auth.interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

const storage = createJSONStorage<AuthState>(() => AsyncStorage);

const INITIAL_STATE: AuthState = {
	accessToken: null,
	refreshToken: null,
	isLoading: false,
	error: null,
};

export const authAtom = atomWithStorage('auth', INITIAL_STATE, storage);

export const loginAtom = atom(
	get => get(authAtom),
	async (_get, set, { email, password }: LoginRequest) => {
		set(authAtom, {
			isLoading: true,
			accessToken: null,
			refreshToken: null,
			error: null,
		});
		try {
			console.log(API.login);
			const { data } = await axios.post<{ data: AuthResponse }>(
				API.login,
				{
					email,
					password,
				},
			);
			console.log(data);
			set(authAtom, {
				isLoading: false,
				accessToken: data.data.accessToken,
				refreshToken: data.data.refreshToken,
				error: null,
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				set(authAtom, {
					isLoading: false,
					accessToken: null,
					refreshToken: null,
					error: error.response?.data.message || error.message,
				});
			}
		}
	},
);

export const logoutAtom = atom(null, async (_get, set) => {
	set(authAtom, INITIAL_STATE);
});

export interface AuthState {
	accessToken: string | null;
	refreshToken: string | null;
	isLoading: boolean;
	error: string | null;
}
