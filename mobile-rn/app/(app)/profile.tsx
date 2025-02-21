import { logoutAtom } from '@/entities/auth/model/auth.state';
import { loadProfileAtom } from '@/entities/user/model/user.state';
import { Grid } from '@/features/profile/ui/Grid';
import { Header } from '@/features/profile/ui/Header';
import { ProfileInfo } from '@/features/profile/ui/ProfileInfo';
import { Button } from '@/shared/Button/Button';
import { Colors } from '@/shared/tokens';
import { useAtom } from 'jotai';
import { useSetAtom } from 'jotai/index';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export default function ProfilePage() {
	const [profile, loadProfile] = useAtom(loadProfileAtom);
	const logout = useSetAtom(logoutAtom);
	useEffect(() => {
		loadProfile();
	}, []);
	const user = profile.profile;
	if (!user) {
		return null;
	}
	return (
		<>
			<View style={styles.container}>
				<View style={styles.content}>
					<Header email={user.email} />
					<ProfileInfo user={user} />
				</View>
				<Grid />
				<View style={styles.button}>
					<Button text='Выйти' onPress={logout} />
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.blackLight,
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
