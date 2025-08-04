import { Colors } from '@/shared/tokens';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EditableProfileForm } from './EditableProfileForm';

export const EditProfilePage: React.FC = () => {
	// const [, loadProfile] = useAtom(loadProfile);
	// const [userProfile, setUserProfile] = useState<UserProfileData | null>(
	// 	null,
	// );

	useEffect(() => {
		const loadUserData = async () => {
			// Загружаем профиль из хранилища или API
			await loadProfile();

			// Получаем данные для формы редактирования
		};

		loadUserData();
	}, []);

	// // Если данные не загружены, показываем пустой экран
	// if (!userProfile) {
	// 	return (
	// 		<SafeAreaView style={styles.container}>
	// 			<View style={styles.content} />
	// 		</SafeAreaView>
	// 	);
	// }

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				{/* <EditableProfileForm
					initialData={userProfile}
					onCancel={() => router.back()}
				/> */}
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
