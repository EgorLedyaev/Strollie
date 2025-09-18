import { forwardRef } from 'react';
// eslint-disable-next-line no-restricted-imports
import { StyleSheet, Text, TextProps } from 'react-native';

import { Colors, Fonts } from '@/shared/tokens';

type AppTextVariant = 'body' | 'h1' | 'h2' | 'caption' | 'button' | 'header';

interface AppTextProps extends TextProps {
	variant?: AppTextVariant;
}

/**
 * Компонент для отображения текста с предустановленными стилями;
 * по умолчанию размер шрифта 16 и стиль regular
 */
export const AppText = forwardRef<Text, AppTextProps>(
	({ style, variant = 'body', ...props }, ref) => {
		return (
			<Text
				ref={ref}
				{...props}
				style={[styles.text, styles[variant], style]}
			/>
		);
	},
);

AppText.displayName = 'AppText';

const styles = StyleSheet.create({
	body: {
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
	},
	button: {
		color: Colors.white,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f18,
	},
	caption: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	h1: {
		fontFamily: Fonts.bold,
		fontSize: Fonts.f32,
	},
	h2: {
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f24,
	},
	header: {
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
	},

	text: {
		color: Colors.headerAndInputText, // Базовый цвет текста
		includeFontPadding: false, // Глобальное правило
	},
});
