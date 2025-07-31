import { Colors, Fonts } from '@/src/shared/tokens';
import { AppButton, CustomLink, Input } from '@/src/shared/ui';
import { useState } from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

import { useRegister } from '@/src/features/auth-by-email';

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
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardAvoiding}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView
						contentContainerStyle={styles.scrollContainer}
						style={styles.contentContainer}
						keyboardShouldPersistTaps='handled'
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.headerBlock}>
							<Text style={styles.title}>Регистрация</Text>
						</View>
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
								text='Далее'
								onPress={handleRegister}
								isLoading={isLoading}
							/>
						</View>

						{error && <Text style={styles.errorText}>{error}</Text>}
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
			<View style={styles.footer}>
				<Text style={styles.footerText}>Уже зарегистрированы?</Text>
				<CustomLink href='/sign-in' text='Войти' replace />
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
	headerBlock: {
		marginBottom: 120,
	},
	title: {
		fontFamily: Fonts.bold,
		fontSize: 32,
		color: Colors.inputText,
		marginTop: 30,
		alignSelf: 'center',
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
