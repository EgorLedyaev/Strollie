import { router } from 'expo-router';
import { useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import {
	checkEmailAndProceedAtom,
	registrationErrorAtom,
	registrationIsLoadingAtom,
	registrationStateAtom,
} from '@/features/auth-by-email';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppButton, AppText, CustomLink, Input } from '@/shared/ui';
import { StatusBarBackground } from '@/shared/ui/StatusBarBackground';

/**
 * Страница регистрации пользователя по email.
 * Позволяет ввести email и перейти к следующему шагу регистрации.
 */
export function RegisterPage() {
	const [regState, setRegState] = useAtom(registrationStateAtom);
	const [isLoading] = useAtom(registrationIsLoadingAtom);
	const [error, setError] = useAtom(registrationErrorAtom);
	const checkEmailAndProceed = useSetAtom(checkEmailAndProceedAtom);

	// Очищаем ошибку при входе на экран
	useEffect(() => {
		setError(null);
	}, [setError]);

	const handleNext = () => {
		checkEmailAndProceed({
			onSuccess: () => {
				router.push('/user-data');
			},
		});
	};

	const setEmail = (email: string) => {
		setRegState(prev => ({ ...prev, email }));
		if (error) {
			setError(null);
		}
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
							Регистрация
						</AppText>
					</View>
					<View style={styles.formContainer}>
						<View style={styles.inputGroup}>
							<AppText style={styles.label}>E-mail</AppText>
							<Input
								placeholder='Введите свою эл.почту'
								value={regState.email}
								onChangeText={setEmail}
								keyboardType='email-address'
								autoCapitalize='none'
								isInvalid={!!error}
							/>
						</View>

						<AppButton
							text='Далее'
							onPress={handleNext}
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
	appButton: {
		height: 54,
	},

	content: {
		flex: 1,
		justifyContent: 'center',
	},
	errorText: {
		color: Colors.error,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		marginTop: 16,
		textAlign: 'center',
	},
	footer: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 10,
		justifyContent: 'center',
		marginTop: 'auto',
		paddingBottom: 40,
	},
	footerText: {
		color: Colors.secondaryText,
		fontFamily: Fonts.medium,
	},
	formContainer: {
		gap: 32,
	},
	headerBlock: {
		alignItems: 'center',
		marginBottom: 60,
	},
	inputGroup: {
		gap: 12,
	},
	label: {
		fontFamily: Fonts.medium,
		marginLeft: 16,
	},
	safeArea: {
		backgroundColor: Colors.lightBackground,
		flex: 1,
	},
	scrollContainer: {
		flexGrow: 1,
		paddingHorizontal: 16,
	},
	title: {
		marginTop: 30,
	},
});
