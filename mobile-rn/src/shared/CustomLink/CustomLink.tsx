import { Colors, Fonts } from '@/src/shared/tokens';
import { Link, LinkProps } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

export const CustomLink = ({
	text,
	...props
}: LinkProps & { text: string }) => {
	return (
		<Link {...props}>
			<Text style={styles.link}>{text}</Text>
		</Link>
	);
};

const styles = StyleSheet.create({
	link: {
		fontSize: Fonts.f16,
		color: Colors.greenLink,
		fontFamily: Fonts.medium,
	},
});
