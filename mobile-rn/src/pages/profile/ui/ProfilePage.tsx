import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAtomValue } from 'jotai';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useLogout } from '@/features/logout';
import { ProfileHeader, ProfileMenuOverlay } from '@/features/profile';
import { sessionAtom } from '@/entities/session';
import { Colors } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

import { ProfileNavGrid } from './ProfileNavGrid';

export const ProfilePage: React.FC = () => {
	const session = useAtomValue(sessionAtom);
	const userProfile = session?.userProfile;
	const [isMenuVisible, setMenuVisible] = useState(false);
	const logout = useLogout();
	const insets = useSafeAreaInsets();

	if (!userProfile) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.centered}>
					<AppText>Профиль не найден</AppText>
				</View>
			</SafeAreaView>
		);
	}

	const handleLogout = () => {
		setMenuVisible(false);
		setTimeout(() => {
			logout();
		}, 100);
	};

	const handleEditProfile = () => {
		setMenuVisible(false);
		router.push('/profile/edit');
	};

	const handleSettings = () => {
		setMenuVisible(false);
		console.log('Settings pressed');
	};

	const handleHelp = () => {
		setMenuVisible(false);
		console.log('Help pressed');
	};

	return (
		<SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
			<StatusBar style='dark' backgroundColor={Colors.lightBackground} />
			<ProfileHeader
				user={userProfile}
				onMenuPress={() => setMenuVisible(true)}
			/>
			<ProfileNavGrid />
			<ProfileMenuOverlay
				visible={isMenuVisible}
				onClose={() => setMenuVisible(false)}
				onEditProfile={handleEditProfile}
				onSettings={handleSettings}
				onHelp={handleHelp}
				onLogout={handleLogout}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightBackground,
		paddingHorizontal: 16,
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
