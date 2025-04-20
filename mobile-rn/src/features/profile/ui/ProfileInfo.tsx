import BirthdayIcon from '@/assets/icons/BirthdayIcon';
import LocationIcon from '@/assets/icons/map/LocationIcon';
import OutLinePointerIcon from '@/assets/profile/OutlinePointerIcon';
import { User } from '@/src/entities/user/model/user.model';
import { Colors, Fonts } from '@/src/shared/tokens';
import { StyleSheet, Text, View } from 'react-native';

export function ProfileInfo({ user }: { user: User }) {
	return (
		<View style={styles.profile}>
			<View style={styles.avatar}></View>
			<View style={styles.description}>
				<Text style={styles.info}>Иван Иванов</Text>
				<View style={styles.infoRow}>
					<OutLinePointerIcon />
					<Text style={styles.text}>{user.email}</Text>
				</View>
				<View style={styles.infoRow}>
					<BirthdayIcon />
					<Text style={styles.text}>{user.created_at}</Text>
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
