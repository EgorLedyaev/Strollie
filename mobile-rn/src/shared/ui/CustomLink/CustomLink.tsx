import { Link } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Colors, Fonts } from '@/src/shared/tokens';

import { AppText } from '../Text';
import { CustomLinkProps } from './CustomLinkProps';
import { JSX } from 'react';

/**
 * Компонент для создания кастомной ссылки с текстом.
 * Используется для навигации между страницами приложения.
 *
 * @param {CustomLinkProps} props - Свойства компонента.
 * @returns {JSX.Element} - Элемент ссылки с текстом.
 */
export const CustomLink = ({ text, ...props }: CustomLinkProps): JSX.Element => {
	return (
		<Link {...props} asChild>
			<TouchableOpacity>
				<AppText style={styles.link}>{text}</AppText>
			</TouchableOpacity>
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
