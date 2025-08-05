// import { ProfileHeader } from '@/widgets/profile-header';
// import { ProfileNavGrid } from '@/widgets/profile-nav-grid';
import { useAtomValue } from 'jotai';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileHeader } from '@/features/profile';
import { sessionAtom } from '@/entities/session';
import { Colors } from '@/shared/tokens';

import { ProfileNavGrid } from './ProfileNavGrid';
import { StatusBar } from 'expo-status-bar';

export const ProfilePage: React.FC = () => {
	const session = useAtomValue(sessionAtom);
	const insets = useSafeAreaInsets();

	return (
		<SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
			<StatusBar style='dark'  backgroundColor={Colors.lightBackground}/>
			<View style={styles.content}>
				<ProfileHeader
					email={session?.userProfile?.email ?? 'Email не указан'}
					onMenuPress={() => {}}
				/>
			</View>
			<ProfileNavGrid />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightBackground,
		paddingHorizontal: 16,
	},
	content: {
		backgroundColor: Colors.white,
		borderRadius: 20,
		marginBottom: 20,
	},
});
