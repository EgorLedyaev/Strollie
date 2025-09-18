import BirthdayIcon from '@/assets/profile/BirthdayIcon';
import OutLinePointerIcon from '@/assets/profile/OutlinePointerIcon';
import { StyleSheet, View } from 'react-native';

import { type User } from '@/entities/user';
import { Fonts } from '@/shared/tokens';
import { AppText, Avatar } from '@/shared/ui';

interface ProfileInfoProps {
	user?: User;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
	const fullName = user
		? `${user.firstName} ${user.lastName}`
		: 'Иван Иванов';

	const birthDate = user?.birthDate || 'Не указана';
	const city = user?.city || 'Не указан';

	return (
		<View style={styles.profile}>
			<Avatar uri={user?.photo} />
			<View style={styles.description}>
				<AppText style={styles.info}>{fullName}</AppText>
				<View style={styles.infoRow}>
					<OutLinePointerIcon />
					<AppText style={styles.text}>{city}</AppText>
				</View>
				<View style={styles.infoRow}>
					<BirthdayIcon />
					<AppText style={styles.text}>{birthDate}</AppText>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	description: { gap: 9 },

	info: {
		fontFamily: Fonts.semibold,
	},
	infoRow: {
		flexDirection: 'row',
		gap: 5,
	},
	profile: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 20,
	},
	text: {
		fontSize: Fonts.f14,
	},
});
