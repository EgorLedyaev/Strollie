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

import { Colors } from '@/shared/tokens';

import { AppTextInput } from '../Text';

export const Input = ({
	isPassword,
	isInvalid,
	style,
	...props
}: TextInputProps & { isPassword?: boolean; isInvalid?: boolean }) => {
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
	input: {
		height: 54,
		borderRadius: 16,
		paddingHorizontal: 16,
		backgroundColor: Colors.white,
		borderWidth: 1,
		borderColor: Colors.inputBorder,
		textAlignVertical: 'center',
	},
	inputInvalid: {
		borderColor: Colors.error,
	},
	inputFocused: {
		borderWidth: 0,
		borderBottomWidth: 2,
		borderColor: Colors.successGreen,
	},
	eyeIcon: {
		position: 'absolute',
		right: 0,
		paddingHorizontal: 20,
		paddingVertical: 18,
	},
});
