import { router } from 'expo-router';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
	ProfileHeader,
	ProfileMenuOverlay,
	useLogout,
} from '@/features/profile';
import { sessionAtom } from '@/entities/session';
import { loadUserProfileAtom, userProfileAtom } from '@/entities/user';
import { Colors } from '@/shared/tokens';
import { AppText } from '@/shared/ui';
import { StatusBarBackground } from '@/shared/ui/StatusBarBackground';

import { ProfileNavGrid } from './ProfileNavGrid';

export const ProfilePage: React.FC = () => {
	const session = useAtomValue(sessionAtom);
	const [userState] = useAtom(userProfileAtom);
	const loadProfile = useSetAtom(loadUserProfileAtom);

	const [isMenuVisible, setMenuVisible] = useState(false);
	const [menuAnchor, setMenuAnchor] = useState<{
		x: number;
		y: number;
		width: number;
		height: number;
	} | null>(null);
	const logout = useLogout();
	const insets = useSafeAreaInsets();

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
		<SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
			<StatusBarBackground color={Colors.lightBackground} />
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
				offset={{ dx: menuAnchor?.width, dy: menuAnchor?.y }}
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
