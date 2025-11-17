import { Link } from 'expo-router';
import { JSX } from 'react';
import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@/shared/tokens';

import { ActionTouchable } from '../Button';
import { AppText } from '../Text';
import { CustomLinkProps } from './CustomLinkProps';

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
			<ActionTouchable feedback='opacity'>
				<AppText style={styles.link}>{text}</AppText>
			</ActionTouchable>
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
