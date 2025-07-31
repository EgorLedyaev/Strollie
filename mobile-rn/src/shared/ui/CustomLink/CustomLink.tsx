import { Colors, Fonts } from '@/src/shared/tokens';
import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { CustomLinkProps } from './CustomLinkProps';

export const CustomLink = ({ text, ...props }: CustomLinkProps) => {
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
