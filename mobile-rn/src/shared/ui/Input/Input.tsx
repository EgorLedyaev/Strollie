import EyeClosedIcon from '@/assets/icons/eye-closed';
import EyeOpenedIcon from '@/assets/icons/eye-opened';
import { useState } from 'react';
import {
	NativeSyntheticEvent,
	Pressable,
	StyleSheet,
	TextInputFocusEventData,
	TextInputProps,
	View,
} from 'react-native';

import { Colors, Radius } from '@/shared/tokens';

import { InputProps } from '.';
import { AppTextInput } from '../Text';

export const Input = ({
	isPassword,
	isInvalid,
	style,
	...props
}: TextInputProps & InputProps) => {
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(false);

	// Функции для обработки фокуса и его потери
	const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
		setIsFocused(true);
		if (props.onFocus) {
			props.onFocus(e);
		}
	};

	const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
		setIsFocused(false);
		if (props.onBlur) {
			props.onBlur(e);
		}
	};

	return (
		<View style={styles.container}>
			<AppTextInput
				cursorColor={Colors.headerAndInputText}
				placeholderTextColor={Colors.placeHolderInput}
				style={[
					styles.input,
					isInvalid && styles.inputInvalid,
					isFocused && styles.inputFocused,
					style, // Позволяем передавать пользовательские стили
				]}
				secureTextEntry={isPassword && !isPasswordVisible}
				onFocus={handleFocus}
				onBlur={handleBlur}
				{...props}
			/>
			{isPassword && (
				<Pressable
					onPress={() => setIsPasswordVisible(state => !state)}
					style={styles.eyeIcon}
				>
					{isPasswordVisible ? <EyeOpenedIcon /> : <EyeClosedIcon />}
				</Pressable>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		width: '100%',
	},
	eyeIcon: {
		paddingHorizontal: 20,
		paddingVertical: 18,
		position: 'absolute',
		right: 0,
	},
	input: {
		backgroundColor: Colors.white,
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r16,
		borderWidth: 1,
		height: 54,
		paddingHorizontal: 16,
		textAlignVertical: 'center',
	},
	inputFocused: {
		borderBottomWidth: 2,
		borderColor: Colors.successGreen,
		borderWidth: 0,
	},
	inputInvalid: {
		borderColor: Colors.error,
	},
});
