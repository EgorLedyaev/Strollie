import { Colors, Fonts } from '@/shared/tokens';
import { forwardRef } from 'react';
// eslint-disable-next-line no-restricted-imports
import { StyleSheet, Text, TextProps } from 'react-native';

type AppTextVariant = 'body' | 'h1' | 'h2' | 'caption' | 'button' | 'header';

interface AppTextProps extends TextProps {
	variant?: AppTextVariant;
}

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
	text: {
		includeFontPadding: false, // Глобальное правило
		color: Colors.headerAndInputText, // Базовый цвет текста
	},
	body: {
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
	},
	h1: {
		fontFamily: Fonts.bold,
		fontSize: Fonts.f32,
	},
	h2: {
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f24,
	},
	caption: {
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		color: Colors.textGray,
	},
	button: {
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f18,
		color: Colors.white,
	},

	header: {
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
	},
});
