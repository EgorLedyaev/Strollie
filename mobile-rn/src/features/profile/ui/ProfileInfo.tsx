import BirthdayIcon from '@/assets/icons/BirthdayIcon';
import OutLinePointerIcon from '@/assets/profile/OutlinePointerIcon';
import { StyleSheet, View } from 'react-native';

import { type User } from '@/entities/user';
import { Colors, Fonts } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

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
			<View style={styles.avatar}></View>
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
	profile: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 20,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: Colors.grayAvatar,
	},
	infoRow: {
		flexDirection: 'row',
		gap: 5,
	},
	text: {
		fontSize: Fonts.f14,
	},
	info: {
		fontFamily: Fonts.semibold,
	},
	description: { gap: 9 },
});
