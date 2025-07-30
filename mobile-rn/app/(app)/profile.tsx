import { loadProfileAtom } from '@/src/entities/user/model/user.state';
import { Grid } from '@/src/features/profile/ui/Grid';
import { Header } from '@/src/features/profile/ui/Header';
import { ProfileInfo } from '@/src/features/profile/ui/ProfileInfo';
import { ProfileMenuOverlay } from '@/src/features/profile/ui/ProfileMenuOverlay';
import { EditProfileScreen, UserProfileData } from '@/src/features/profile/ui/EditProfileScreen';
import { AppButton } from '@/src/shared/Button/AppButton';
import { Colors } from '@/src/shared/tokens';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '@/src/entities/user/model/user.model';
import { router } from 'expo-router';
import { AuthStorage } from '@/src/entities/auth/model/auth-storage';
import { useAuth } from '@/src/entities/auth/model/auth-context';

export default function ProfilePage() {
	const [profile, loadProfile] = useAtom(loadProfileAtom);
	const [menuVisible, setMenuVisible] = useState(false);
	const [showEditProfile, setShowEditProfile] = useState(false);
	const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
	
	const { logout } = useAuth();
	
	useEffect(() => {
		const loadUserData = async () => {
			// Загружаем профиль из хранилища или API
			await loadProfile();
			
			// Получаем данные для формы редактирования
			const storedProfile = await AuthStorage.getUserProfile();
			if (storedProfile) {
				setUserProfile({
					firstName: storedProfile.firstName || '',
					lastName: storedProfile.lastName || '',
					middleName: storedProfile.middleName || '',
					nickname: storedProfile.nickname || '',
					city: storedProfile.city || '',
					birthDate: storedProfile.birthDate || '',
					aboutMe: storedProfile.aboutMe || '',
				});
			}
		};
		
		loadUserData();
	}, []);
	
	// Используем данные профиля или заглушку
	const user = profile.profile || {
		email: '@username',
		user_id: 'user123',
		created_at: '12.01.2004',
	};
	
	const handleMenuPress = () => {
		setMenuVisible(true);
	};
	
	const handleMenuClose = () => {
		setMenuVisible(false);
	};
	
	const handleEditProfile = () => {
		setMenuVisible(false);
		setShowEditProfile(true);
	};
	
	const handleSaveProfile = async (data: UserProfileData) => {
		setUserProfile(data);
		setShowEditProfile(false);
		
		try {
			// Обновляем профиль пользователя, объединяя существующие данные с новыми
			const updatedProfile = {
				...user,
				firstName: data.firstName,
				lastName: data.lastName,
				middleName: data.middleName,
				city: data.city,
				birthDate: data.birthDate,
				aboutMe: data.aboutMe,
				nickname: data.nickname
			};
			
			// Сохраняем обновленный профиль локально
			await AuthStorage.saveUserProfile(updatedProfile);
			
			// Перезагружаем профиль для обновления UI
			loadProfile();
		} catch (error) {
			console.error('Ошибка при сохранении профиля', error);
		}
	};
	
	const handleSettings = () => {
		setMenuVisible(false);
		// Реализация перехода на страницу настроек
	};
	
	const handleHelp = () => {
		setMenuVisible(false);
		// Реализация перехода на страницу помощи
	};
	
	if (!user) {
		return null;
	}
	
	if (showEditProfile) {
		return <EditProfileScreen user={user} onSave={handleSaveProfile} />;
	}
	
	return (
		<>
			<SafeAreaView style={styles.container}>
				<View style={styles.content}>
					<Header email={user.email} onMenuPress={handleMenuPress} />
					<ProfileInfo user={user} profileData={userProfile || undefined} />
				</View>
				<Grid />
				
				<ProfileMenuOverlay 
					visible={menuVisible}
					onClose={handleMenuClose}
					onEditProfile={handleEditProfile}
					onSettings={handleSettings}
					onHelp={handleHelp}
					onLogout={logout}
				/>
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightBackground,
		paddingHorizontal: 10,
		paddingBottom: 20,
	},
	content: {
		gap: 20,
		backgroundColor: Colors.white,
		padding: 20,
		borderRadius: 20,
		marginBottom: 20,
	},
});
