import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { authErrorAtom, useLogin } from '@/features/auth-by-email';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppButton, AppText, CustomLink, Input } from '@/shared/ui';
import { StatusBarBackground } from '@/shared/ui/StatusBarBackground';

/**
 * Страница входа в систему по email.
 * Позволяет пользователю ввести email и перейти к верификации.
 */
export function SignInPage() {
	const [email, setEmail] = useState('');
	const [error, setError] = useAtom(authErrorAtom);
	const { loginWithEmail, isLoading } = useLogin();

	const handleSignIn = () => {
		setError(null);
		loginWithEmail(email, {
			onSuccess: () => {
				router.push('/verify-code');
			},
		});
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBarBackground color={Colors.lightBackground} />
			<SystemBars style='dark' />
			<KeyboardAwareScrollView
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps='handled'
			>
				<View style={styles.content}>
					<View style={styles.headerBlock}>
						<AppText variant='h1' style={styles.title}>
							Вход
						</AppText>
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
								isInvalid={!!error}
							/>
						</View>
						<AppButton
							text='Войти'
							onPress={handleSignIn}
							isLoading={isLoading}
							style={styles.appButton}
							buttonBorderRadius={Radius.r22}
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
		marginLeft: 16,
	},
	errorText: {
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
		fontFamily: Fonts.medium,
		color: Colors.textGray,
	},
	appButton: {
		height: 54,
	},
});
