import unmatched from '@/assets/images/unmatched.png';
import { Image, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Gaps } from '@/shared/tokens';
import { AppText, CustomLink } from '@/shared/ui';

export default function NotFoundScreen() {
	return (
		<>
			<View style={styles.container}>
				<View style={styles.content}>
					<Image
						source={unmatched}
						resizeMode='contain'
						style={styles.image}
					/>
					<AppText style={styles.text}>
						Ооо... Что-то пошло не так. Попробуйте вернуться на
						главный экран приложения
					</AppText>
					<CustomLink href='/' text='На главный экран' />
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 55,
	},
	content: {
		alignItems: 'center',
		gap: Gaps.g50,
	},

	text: {
		color: Colors.white,
		fontSize: Fonts.f18,
		textAlign: 'center',
		fontFamily: Fonts.regular,
	},
	image: {
		width: 204,
		height: 282,
	},
});
