import MenuIcon from '@/assets/icons/menu';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ProfileMenu } from '@/src/features/open-profile-menu';
import { profileAtom } from '@/src/entities/user';
import { Colors } from '@/src/shared/tokens';
import { AppText, Avatar } from '@/src/shared/ui';

export const ProfileHeader = () => {
	const [userState] = useAtom(profileAtom);
	const { profile } = userState;
	const [menuVisible, setMenuVisible] = useState(false);

	if (!profile) {
		// Показываем заглушку или лоадер
		return null;
	}

	return (
		<>
			<View style={styles.container}>
				<View style={styles.profileInfo}>
					<Avatar uri={profile.photo} size={64} />
					<View style={styles.userInfo}>
						<AppText style={styles.name}>
							{profile.firstName} {profile.lastName}
						</AppText>
						<AppText style={styles.location}>
							{profile.city || 'Город не указан'}
						</AppText>
					</View>
				</View>
				<TouchableOpacity onPress={() => setMenuVisible(true)}>
					<MenuIcon />
				</TouchableOpacity>
			</View>

			<ProfileMenu
				visible={menuVisible}
				onClose={() => setMenuVisible(false)}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
		paddingHorizontal: 16,
	},
	profileInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	userInfo: {
		marginLeft: 16,
	},
	name: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.headerAndInputText,
		marginBottom: 2,
	},
	location: {
		fontSize: 14,
		color: Colors.textGray,
	},
});
