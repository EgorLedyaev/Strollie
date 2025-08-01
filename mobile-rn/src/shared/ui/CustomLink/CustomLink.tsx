import { Colors, Fonts } from '@/src/shared/tokens';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { CustomLinkProps } from './CustomLinkProps';
import { AppText } from '../Text';

export const CustomLink = ({ text, ...props }: CustomLinkProps) => {
	return (
		<Link {...props}>
			<AppText style={styles.link}>{text}</AppText>
		</Link>
	);
};

const styles = StyleSheet.create({
	link: {
		fontSize: Fonts.f16,
		color: Colors.greenLink,
		fontFamily: Fonts.medium,
		textDecorationLine: 'underline',
	},
});
