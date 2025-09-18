import { Link } from 'expo-router';
import { JSX } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Colors, Fonts } from '@/shared/tokens';

import { AppText } from '../Text';
import { CustomLinkProps } from './CustomLinkProps';
import { IconButton } from '../Button';

/**
 * Компонент для создания кастомной ссылки с текстом.
 * Используется для навигации между страницами приложения.
 *
 * @param {CustomLinkProps} props - Свойства компонента.
 * @returns {JSX.Element} - Элемент ссылки с текстом.
 */
export const CustomLink = ({
	text,
	...props
}: CustomLinkProps): JSX.Element => {
	return (
		<Link {...props} asChild>
			<IconButton feedback='opacity'>
				<AppText style={styles.link}>{text}</AppText>
			</IconButton>
		</Link>
	);
};

const styles = StyleSheet.create({
	link: {
		color: Colors.greenLink,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
		textDecorationLine: 'underline',
	},
});
