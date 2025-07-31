import { Colors } from '@/src/shared/tokens';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLogout } from '@/src/features/logout';
import {
	EditProfileScreen,
	Grid,
	Header,
	ProfileInfo,
	ProfileMenuOverlay,
	UserProfileData,
} from '@/src/features/profile';
import {
	loadProfileAtom,
	UserProfileStorage,
	type User,
} from '@/src/entities/user';

export const ProfilePage = () => {
	const [profile, loadProfile] = useAtom(loadProfileAtom);
	const [menuVisible, setMenuVisible] = useState(false);
	const [showEditProfile, setShowEditProfile] = useState(false);
	const [userProfile, setUserProfile] = useState<UserProfileData | null>(
		null,
	);

	const logout = useLogout();

	useEffect(() => {
		const loadUserData = async () => {
			// Загружаем профиль из хранилища или API
			await loadProfile();

			// Получаем данные для формы редактирования
			const storedProfile = await UserProfileStorage.getUserProfile();
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
		user_id: 'temp',
		email: '',
		created_at: new Date().toISOString(),
		firstName: 'Загрузка...',
		lastName: '',
		nickname: '',
		city: '',
		birthDate: '',
	};

	// Если нет данных для редактирования, создаем их из профиля
	const currentUserProfile = userProfile || {
		firstName: user.firstName || '',
		lastName: user.lastName || '',
		middleName: '',
		nickname: user.nickname || '',
		city: user.city || '',
		birthDate: user.birthDate || '',
		aboutMe: '',
	};

	const handleSaveProfile = async (userData: UserProfileData) => {
		try {
			await UserProfileStorage.saveUserProfile(userData);
			setUserProfile(userData);
			setShowEditProfile(false);

			// Перезагружаем профиль
			await loadProfile();
		} catch (error) {
			console.error('Ошибка сохранения профиля:', error);
		}
	};

	const handleLogout = async () => {
		setMenuVisible(false);
		await logout();
		router.replace('/sign-in');
	};

	if (showEditProfile) {
		return <EditProfileScreen user={user} onSave={handleSaveProfile} />;
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Header
					email={user.email || 'Почта не указана'}
					onMenuPress={() => setMenuVisible(true)}
				/>
				<ProfileInfo user={user} profileData={currentUserProfile} />
			</View>
			<Grid />

			<ProfileMenuOverlay
				visible={menuVisible}
				onClose={() => setMenuVisible(false)}
				onEditProfile={() => {
					setMenuVisible(false);
					setShowEditProfile(true);
				}}
				onSettings={() => console.log('Settings')}
				onHelp={() => console.log('Help')}
				onLogout={handleLogout}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightBackground,
		paddingHorizontal: 10,
	},
	content: {
		gap: 20,
		backgroundColor: Colors.white,
		padding: 20,
		borderRadius: 20,
		marginBottom: 20,
	},
});
