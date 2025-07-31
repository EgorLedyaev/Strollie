import { Colors, Fonts } from '@/src/shared/tokens';
import { AppButton, CustomLink, Input } from '@/src/shared/ui';
import { useState } from 'react';
import {
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

import { useLogin } from '@/src/features/auth-by-email';

export function SignInPage() {
	const [email, setEmail] = useState('');
	const { loginWithEmail, isLoading, error } = useLogin();

	const handleSignIn = async () => {
		await loginWithEmail(email);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar
				barStyle='dark-content'
				backgroundColor={Colors.lightBackground}
			/>
			<View style={styles.container}>
				<Text style={styles.title}>Вход</Text>

				<View style={styles.formContainer}>
					<View style={styles.inputGroup}>
						<Text style={styles.label}>E-mail</Text>
						<Input
							placeholder='Введите свою эл.почту'
							value={email}
							onChangeText={setEmail}
							keyboardType='email-address'
							autoCapitalize='none'
						/>
					</View>

					<AppButton
						text='Войти'
						onPress={handleSignIn}
						isLoading={isLoading}
					/>
				</View>

				{error && <Text style={styles.errorText}>{error}</Text>}

				<View style={styles.footer}>
					<Text style={styles.footerText}>Нет аккаунта?</Text>
					<CustomLink
						href='/register'
						text='Зарегистрироваться'
						replace
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: Colors.lightBackground,
	},
	keyboardAvoiding: {
		flex: 1,
	},
	scrollContainer: {
		flexGrow: 1,
		justifyContent: 'center',
	},
	contentContainer: {
		paddingHorizontal: 16,
	},
	title: {
		fontFamily: Fonts.semibold,
		fontSize: 32,
		color: Colors.inputText,
		marginTop: 95,
		alignSelf: 'center',
	},
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingBottom: 20,
	},
	formContainer: {
		gap: 32,
		// marginBottom: 20,
		marginTop: 147,
	},
	inputGroup: {
		gap: 12,
	},
	label: {
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
		color: Colors.inputText,
		marginLeft: 16,
	},
	errorText: {
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		color: Colors.error,
		marginTop: 16,
		textAlign: 'center',
	},
	separator: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 32,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 10,
		paddingBottom: 40,
	},
	footerText: {
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
		color: Colors.textGray,
	},
});
