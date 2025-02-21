import { authAtom } from '@/entities/auth/model/auth.state';
import { API } from '@/entities/user/api/api';
import { User } from '@/entities/user/model/user.model';
import axios, { AxiosError } from 'axios';
import { atom } from 'jotai';

export const profileAtom = atom<UserState>({
	profile: null,
	isLoading: false,
	error: null,
});

export const loadProfileAtom = atom(
	async get => {
		return get(profileAtom);
	},
	async (get, set) => {
		const { accessToken } = await get(authAtom);
		set(profileAtom, {
			profile: null,
			isLoading: true,
			error: null,
		});
		try {
			const { data } = await axios.get<{ data: User }>(API.profile, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			console.log('data', data);
			set(profileAtom, {
				isLoading: false,
				profile: data.data,
				error: null,
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				set(profileAtom, {
					isLoading: false,
					profile: null,
					error: error.response?.data.message || error.message,
				});
			}
		}
	},
);

export interface UserState {
	profile: User | null;
	isLoading: boolean;
	error: string | null;
}
