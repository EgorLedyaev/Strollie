import ActionIcon from '@/assets/icons/action';
import ArrowLeftIcon from '@/assets/icons/arrow-left';
import { useNavigation } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { User } from '@/entities/user';
import { Colors, Fonts, Shadows } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';

import { ProfileInfo } from './ProfileInfo';

interface HeaderProps {
	user: User;
	onMenuPress: () => void;
}

const HIT_SLOP = { top: 15, bottom: 15, left: 15, right: 15 };
export function ProfileHeader({ user, onMenuPress }: HeaderProps) {
	const navigation = useNavigation();
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<IconButton
					onPress={() => navigation.goBack()}
					hitSlop={HIT_SLOP}
					feedback='opacity'
				>
					<ArrowLeftIcon />
				</IconButton>
				<AppText style={styles.text}>@{user?.email}</AppText>
				<IconButton
					onPress={onMenuPress}
					hitSlop={HIT_SLOP}
					feedback='opacity'
				>
					<ActionIcon />
				</IconButton>
			</View>
			<ProfileInfo user={user} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 160,
		justifyContent: 'space-between',
		padding: 16,
		backgroundColor: Colors.white,
		borderRadius: 20,
		marginBottom: 20,
		boxShadow: Shadows.boxShadow_elev2,
	},
	header: {
		// flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	text: {
		color: Colors.darkGray,
		fontFamily: Fonts.semibold,
	},
});
