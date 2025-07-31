import avatar from '@/assets/images/avatar.png';
import { Colors, Fonts, Gaps } from '@/src/shared/tokens';
import { Image, StyleSheet, Text, View } from 'react-native';

import { User } from '@/src/entities/user/model/user.model';

export const UserMenu = ({ user }: { user: User | null }) => {
	if (!user) {
		return;
	}
	return (
		<>
			<View style={styles.container}>
				{user.photo ? (
					<Image
						style={styles.image}
						source={{
							uri: user.photo,
						}}
					/>
				) : (
					<Image source={avatar} />
				)}
				<Text style={styles.name}>
					{user.name} {user.surname}
				</Text>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		gap: Gaps.g8,
		marginTop: 30,
		marginBottom: 40,
	},
	image: { width: 70, height: 70, borderRadius: 35 },
	name: {
		fontSize: Fonts.f16,
		fontFamily: Fonts.regular,
		color: Colors.white,
	},
});
