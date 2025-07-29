import EyeClosedIcon from '@/assets/icons/eye-closed';
import EyeOpenedIcon from '@/assets/icons/eye-opened';
import { Colors, Fonts, Radius } from '@/src/shared/tokens';
import { useState } from 'react';
import {
	Pressable,
	StyleSheet,
	TextInput,
	TextInputProps,
	View,
} from 'react-native';

export const Input = ({
	isPassword,
	isInvalid,
	...props
}: TextInputProps & { isPassword?: boolean, isInvalid?: boolean }) => {
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
	return (
		<View>
			<TextInput
				placeholderTextColor={Colors.gray}
				style={[styles.input, isInvalid && styles.inputInvalid]}
				secureTextEntry={isPassword && !isPasswordVisible}
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
	input: {
		height: 58,
		borderRadius: Radius.r15,
		paddingHorizontal: 16,
		backgroundColor: Colors.white,
		fontSize: 16,
		color: Colors.black,
		fontFamily: Fonts.regular,
		borderWidth: 1,
		borderColor: 'transparent',
	},
	inputInvalid: {
		borderColor: Colors.error,
	},
	eyeIcon: {
		position: 'absolute',
		right: 0,
		paddingHorizontal: 20,
		paddingVertical: 18,
	},
});
