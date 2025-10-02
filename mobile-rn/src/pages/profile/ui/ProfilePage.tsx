import { router } from 'expo-router';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
	ProfileHeader,
	ProfileMenuOverlay,
	useLogout,
} from '@/features/profile';
import { sessionAtom } from '@/entities/session';
import { loadUserProfileAtom, userProfileAtom } from '@/entities/user';
import type { AnchorRect } from '@/shared/lib/useAnchorMeasurement';
import { Colors } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

import { ProfileNavGrid } from './ProfileNavGrid';

export const ProfilePage: React.FC = () => {
	const session = useAtomValue(sessionAtom);
	const [userState] = useAtom(userProfileAtom);
	const loadProfile = useSetAtom(loadUserProfileAtom);

	const [isMenuVisible, setMenuVisible] = useState(false);
	const [menuAnchor, setMenuAnchor] = useState<AnchorRect | null>(null);
	const logout = useLogout();

	useEffect(() => {
		// Загружаем профиль, только если его еще нет или если мы хотим обновить
		if (session.userProfile?.email && !userState.profile) {
			loadProfile(session.userProfile.email);
		}
	}, [session.userProfile, userState.profile, loadProfile]);

	if (userState.isLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.centered}>
					<ActivityIndicator
						size='large'
						color={Colors.greenPrimary}
					/>
				</View>
			</SafeAreaView>
		);
	}
	const userProfile = userState.profile;

	if (userState.error) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.centered}>
					<AppText>Ошибка: {userState.error}</AppText>
				</View>
			</SafeAreaView>
		);
	}

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
		<SafeAreaView style={styles.container}>
			<SystemBars style='dark' />
			<ProfileHeader
				user={userProfile}
				onBackPress={() => router.back()}
				onMenuPress={anchor => {
					setMenuAnchor(anchor);
					setMenuVisible(true);
				}}
			/>
			<ProfileNavGrid />
			<ProfileMenuOverlay
				visible={isMenuVisible}
				onClose={() => setMenuVisible(false)}
				onEditProfile={handleEditProfile}
				onSettings={handleSettings}
				onHelp={handleHelp}
				onLogout={handleLogout}
				anchor={menuAnchor ?? undefined}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	centered: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
	container: {
		backgroundColor: Colors.lightBackground,
		flex: 1,
		padding: 16,
	},
});
