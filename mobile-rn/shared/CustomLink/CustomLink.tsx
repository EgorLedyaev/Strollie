import { Colors, Fonts } from '@/shared/tokens';
import { Link, LinkProps } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

export const CustomLink = ({
	text,
	...props
}: LinkProps & { text: string }) => {
	return (
		<>
			<Link style={styles.link} {...props}>
				<Text>{text}</Text>
			</Link>
		</>
	);
};

const styles = StyleSheet.create({
	link: {
		fontSize: Fonts.f18,
		color: Colors.black,
		fontFamily: Fonts.regular,
	},
});
