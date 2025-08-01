import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { useLogin } from '@/src/features/auth-by-email';
import { Colors, Fonts } from '@/src/shared/tokens';
import { AppButton, AppText, CustomLink, Input } from '@/src/shared/ui';

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
			<KeyboardAwareScrollView
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps='handled'
			>
				<View style={styles.content}>
					<View style={styles.headerBlock}>
						<AppText style={styles.title}>Вход</AppText>
					</View>
					<View style={styles.formContainer}>
						<View style={styles.inputGroup}>
							<AppText style={styles.label}>E-mail</AppText>
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
					{error && (
						<AppText style={styles.errorText}>{error}</AppText>
					)}
				</View>
				<View style={styles.footer}>
					<AppText style={styles.footerText}>Нет аккаунта?</AppText>
					<CustomLink
						href='/register'
						text='Зарегистрироваться'
						replace
					/>
				</View>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
}

// 	</View>

// </View>

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: Colors.lightBackground,
	},

	scrollContainer: {
		flexGrow: 1,
		paddingHorizontal: 16,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
	},
	headerBlock: {
		alignItems: 'center',
		marginBottom: 60,
	},
	title: {
		fontFamily: Fonts.bold,
		fontSize: 32,
		color: Colors.headerAndInputText,
		marginTop: 30,
	},
	formContainer: {
		gap: 32,
	},
	inputGroup: {
		gap: 12,
	},
	label: {
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
		color: Colors.headerAndInputText,
		marginLeft: 16,
	},
	errorText: {
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		color: Colors.error,
		marginTop: 16,
		textAlign: 'center',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 10,
		paddingBottom: 40,
		marginTop: 'auto',
	},
	footerText: {
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
		color: Colors.textGray,
	},
});
