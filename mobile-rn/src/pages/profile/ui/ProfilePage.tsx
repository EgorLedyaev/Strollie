// import { ProfileHeader } from '@/widgets/profile-header';
// import { ProfileNavGrid } from '@/widgets/profile-nav-grid';
import { Colors } from '@/shared/tokens';
import { BottomNavBar } from '@/widgets/bottom-nav-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileNavGrid } from './ProfileNavGrid';

export const ProfilePage: React.FC = () => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>{/* <ProfileHeader /> */}</View>
			<ProfileNavGrid />
			<BottomNavBar />
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
		marginBottom: 20,
	},
});
