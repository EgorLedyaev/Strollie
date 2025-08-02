import { router } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
	EditableProfileForm,
	UserProfileData,
} from '@/src/widgets/editable-profile-form';
import {
	loadProfileAtom,
	UserProfileStorage,
	type User,
} from '@/src/entities/user';
import { Colors } from '@/src/shared/tokens';

export const EditProfilePage: React.FC = () => {
	const [, loadProfile] = useAtom(loadProfileAtom);
	const [userProfile, setUserProfile] = useState<UserProfileData | null>(
		null,
	);

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
					nickname: storedProfile.nickname || '',
					city: storedProfile.city || '',
					birthDate: storedProfile.birthDate || '',
				});
			}
		};

		loadUserData();
	}, []);

	// Если данные не загружены, показываем пустой экран
	if (!userProfile) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.content} />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<EditableProfileForm
					initialData={userProfile}
					onCancel={() => router.back()}
				/>
			</View>
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
		backgroundColor: Colors.white,
		borderRadius: 20,
		padding: 16,
		flex: 1,
	},
});
