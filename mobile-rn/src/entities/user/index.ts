// Публичный API слайса user
import { profileAtom, loadProfileAtom } from './model/user.state';
import { UserMenu } from './ui/UserMenu/UserMenu';
import { UserProfileStorage } from './model/user-profile-storage';
import { type User } from '@/src/shared/lib';

export {
  // State
  profileAtom,
  loadProfileAtom,
  
  // Storage
  UserProfileStorage,
  
  // Components
  UserMenu,
  
  // Types
  type User
};
