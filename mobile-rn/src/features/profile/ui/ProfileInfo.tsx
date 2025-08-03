import BirthdayIcon from '@/assets/icons/BirthdayIcon';
import LocationIcon from '@/assets/icons/map/LocationIcon';
import OutLinePointerIcon from '@/assets/profile/OutlinePointerIcon';
import { StyleSheet, Text, View } from 'react-native';

import { UserProfileData } from '@/features/profile/ui/EditProfileScreen';
import { type User } from '@/entities/user';
import { Colors, Fonts } from '@/shared/tokens';

interface ProfileInfoProps {
	user: User;
	profileData?: UserProfileData;
}

export function ProfileInfo({ user, profileData }: ProfileInfoProps) {
	const fullName = profileData
		? `${profileData.firstName} ${profileData.lastName}`
		: 'Иван Иванов';

	const nickname = profileData?.nickname || user.email;
	const birthDate = profileData?.birthDate || user.created_at;
	const city = profileData?.city || 'Не указан';

	return (
		<View style={styles.profile}>
			<View style={styles.avatar}></View>
			<View style={styles.description}>
				<Text style={styles.info}>{fullName}</Text>
				<View style={styles.infoRow}>
					<OutLinePointerIcon />
					<Text style={styles.text}>{city}</Text>
				</View>
				<View style={styles.infoRow}>
					<BirthdayIcon />
					<Text style={styles.text}>{birthDate}</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	profile: {
		alignItems: 'flex-end',
		flexDirection: 'row',
		gap: 20,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: Colors.gray,
	},
	infoRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
	},
	text: {
		color: Colors.black,
	},
	info: {
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
	},
	description: { gap: 1 },
});
