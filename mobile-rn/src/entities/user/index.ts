// Публичный API слайса user
import { type User } from '@/src/shared/lib';

import { fetchUserProfile, updateUserProfile } from './api/userApi';
import { UserProfileStorage } from './model/user-profile-storage';
import { loadProfileAtom, profileAtom } from './model/user.state';
import { UserMenu } from './ui/UserMenu/UserMenu';

export {
	// State
	profileAtom,
	loadProfileAtom,

	// API
	fetchUserProfile,
	updateUserProfile,

	// Storage
	UserProfileStorage,

	// Components
	UserMenu,

	// Types
	type User,
};
