// Публичный API слайса profile
import { useLogout } from './model/use-logout';
import { useEditProfile } from './model/useEditProfile';
import { AvatarUploader } from './ui/AvatarUploader';
import { EditProfileForm, type UserProfileData } from './ui/EditProfileForm';
import { ProfileHeader } from './ui/ProfileHeader';
import { ProfileInfo } from './ui/ProfileInfo';
import { ProfileMenuOverlay } from './ui/ProfileMenuOverlay';

export {
	// Components
	EditProfileForm,
	ProfileInfo,
	ProfileHeader,
	ProfileMenuOverlay,
	AvatarUploader,

	// Hooks
	useEditProfile,
	useLogout,

	// Types
	type UserProfileData,
};
