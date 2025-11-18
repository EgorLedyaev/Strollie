import { router } from 'expo-router';
import { useAtomValue } from 'jotai';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/widgets/header';
import {
	EditProfileForm,
	useEditProfile,
	type UserProfileData,
} from '@/features/profile';
import { userProfileAtom } from '@/entities/user';
import { Colors } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

export const EditProfilePage: React.FC = () => {
	const {
		profile,
		isLoading: isProfileLoading,
		error: profileError,
	} = useAtomValue(userProfileAtom);
	const { saveProfile, isLoading: isSaving } = useEditProfile();

	const handleSave = async (data: UserProfileData) => {
		const success = await saveProfile(data);
		if (success) {
			router.back();
		}
	};

	if (isProfileLoading) {
		return (
			<SafeAreaView style={styles.centered}>
				<ActivityIndicator size='large' color={Colors.greenPrimary} />
			</SafeAreaView>
		);
	}

	if (profileError || !profile) {
		return (
			<SafeAreaView style={styles.centered}>
				<AppText>
					Ошибка загрузки профиля:{' '}
					{profileError || 'Профиль не найден'}
				</AppText>
			</SafeAreaView>
		);
	}

	return (
		<EditProfileForm
			user={profile}
			onSave={handleSave}
			isSaving={isSaving}
			headerSlot={
				<Header onBackPress={router.back} title='Редактирование' />
			}
		/>
	);
};

const styles = StyleSheet.create({
	centered: {
		alignItems: 'center',
		backgroundColor: Colors.lightBackground,
		flex: 1,
		justifyContent: 'center',
	},
});
