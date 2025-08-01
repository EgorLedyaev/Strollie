import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { useRegister } from '@/src/features/auth-by-email';
import { Colors, Fonts } from '@/src/shared/tokens';
import { AppButton, AppText, CustomLink, Input } from '@/src/shared/ui';

export function RegisterPage() {
	const [email, setEmail] = useState('');
	const { registerEmail, isLoading, error } = useRegister();

	const handleRegister = async () => {
		await registerEmail(email);
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
						<AppText variant='h1' style={styles.title}>
							Регистрация
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
							/>
						</View>

						<AppButton
							text='Далее'
							onPress={handleRegister}
							isLoading={isLoading}
						/>
					</View>
					{error && (
						<AppText style={styles.errorText}>{error}</AppText>
					)}
				</View>
				<View style={styles.footer}>
					<AppText style={styles.footerText}>
						Уже зарегистрированы?
					</AppText>
					<CustomLink href='/sign-in' text='Войти' replace />
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
