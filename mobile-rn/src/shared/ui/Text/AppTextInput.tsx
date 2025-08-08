import { forwardRef } from 'react';
// eslint-disable-next-line no-restricted-imports
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { Colors, Fonts } from '@/shared/tokens';

export const AppTextInput = forwardRef<TextInput, TextInputProps>(
	({ style, ...props }, ref) => {
		return <TextInput ref={ref} {...props} style={[styles.text, style]} />;
	},
);

AppTextInput.displayName = 'AppTextInput';

const styles = StyleSheet.create({
	text: {
		includeFontPadding: false,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
		color: Colors.headerAndInputText,
	},
});
