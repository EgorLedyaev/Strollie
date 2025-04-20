import { logoutAtom } from '@/src/entities/auth/model/auth.state';
import { loadProfileAtom } from '@/src/entities/user/model/user.state';
import { Grid } from '@/src/features/profile/ui/Grid';
import { Header } from '@/src/features/profile/ui/Header';
import { ProfileInfo } from '@/src/features/profile/ui/ProfileInfo';
import { AppButton } from '@/src/shared/Button/AppButton';
import { Colors } from '@/src/shared/tokens';
import { useAtom } from 'jotai';
import { useSetAtom } from 'jotai/index';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfilePage() {
	const [profile, loadProfile] = useAtom(loadProfileAtom);
	const logout = useSetAtom(logoutAtom);
	useEffect(() => {
		// loadProfile();
	}, []);
	const user = profile.profile;
	profile.profile = {
		email: '222',
		user_id: 'John Doe',
		created_at: '1234567890',
	};
	if (!user) {
		return null;
	}
	return (
		<>
			<SafeAreaView style={styles.container}>
				<View style={styles.content}>
					<Header email={user.email} />
					<ProfileInfo user={user} />
				</View>
				<Grid />
				<View style={styles.button}>
					<AppButton text='Выйти' onPress={logout} />
				</View>
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightBackground,
		paddingHorizontal: 10,
	},
	content: {
		gap: 20,
		backgroundColor: Colors.white,
		padding: 20,
		borderRadius: 20,
		marginBottom: 20,
	},
	button: {
		position: 'absolute',
		bottom: 20,
		left: 10,
		right: 10,
	},
});
