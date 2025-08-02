import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	SafeAreaView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useResendCode, useVerifyCode } from '@/src/features/auth-by-email';
import { SessionStorage } from '@/src/entities/session';
import { Colors, Fonts } from '@/src/shared/tokens';
import { AppButton, AppText, BackButton, CodeInput } from '@/src/shared/ui';

export function VerifyCodePage() {
	const [code, setCode] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [timeLeft, setTimeLeft] = useState(60);
	const [canResend, setCanResend] = useState(false);
	const [email, setEmail] = useState('');
	const { verifyCode, isLoading } = useVerifyCode();
	const { resendCode, isLoading: isResending } = useResendCode();

	// Загружаем email из хранилища
	useEffect(() => {
		const loadEmail = async () => {
			const storedEmail = await SessionStorage.getEmail();
			setEmail(storedEmail || '');
		};
		loadEmail();
	}, []);

	useEffect(() => {
		let timer: ReturnType<typeof setInterval>;

		if (timeLeft > 0) {
			timer = setInterval(() => {
				setTimeLeft(prev => prev - 1);
			}, 1000);
		} else {
			setCanResend(true);
		}

		return () => {
			if (timer) clearInterval(timer);
		};
	}, [timeLeft]);

	const handleResendCode = async () => {
		if (!canResend || !isResending) return;
		setError(null);
		const success = await resendCode();
		if (success) {
			setTimeLeft(60);
			setCanResend(false);
		} else {
			setError('Не удалось отправить код повторно.');
		}
	};

	const handleVerifyCode = async () => {
		// 1. Очищаем старые ошибки
		setError(null);

		// 2. Вызываем фичу, передавая ей данные и КОЛЛБЭКИ
		verifyCode(code, {
			onSuccess: () => {
				// 3. Фича сказала "успех". Страница решает, что делать:
				// Стереть историю навигации и отправить пользователя в приложение.
				router.replace('/(app)');
			},
			onError: message => {
				// 4. Фича сказала "провал". Страница решает, что делать:
				// Показать пользователю сообщение об ошибке.
				setError(message);
			},
		});
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
	};

	const insets = useSafeAreaInsets();
	const backButtonTop = insets.top + 16;

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar
				barStyle='dark-content'
				backgroundColor={Colors.lightBackground}
			/>

			<BackButton style={[styles.backButton, { top: backButtonTop }]} />

			<View style={styles.container}>
				<View style={styles.header}>
					<AppText variant='h1' style={styles.title}>Код подтверждения</AppText>
					<AppText style={styles.subtitle}>
						Введите код, отправленный на {email || 'эл. почту'}
					</AppText>
				</View>

				<CodeInput
					value={code}
					onChangeText={setCode}
					length={4}
					autoFocus
					isError={!!error}
					style={styles.codeInput}
				/>
				{error && <AppText style={styles.errorText}>{error}</AppText>}

				<View style={styles.resendContainer}>
					<TouchableOpacity
						disabled={!canResend}
						onPress={handleResendCode}
						activeOpacity={0.7}
					>
						<AppText
							style={[
								styles.resendText,
								canResend && styles.activeResendText,
							]}
						>
							{isResending ? 'Отправка...' : 'Отправить снова'}
						</AppText>
					</TouchableOpacity>

					{!canResend && (
						<AppText style={styles.resendText}>
							через {formatTime(timeLeft)}
						</AppText>
					)}
				</View>

				<View style={styles.buttonContainer}>
					<AppButton
						text='Далее'
						onPress={handleVerifyCode}
						isLoading={isLoading}
						disabled={code.length < 4 || isLoading}
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
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 80,
		alignItems: 'center',
	},
	header: {
		alignItems: 'center',
		marginTop: 85,
		width: '100%',
	},
	backButton: {
		position: 'absolute',
		top: 16, // Ближе к верхнему краю
		left: 16, // Ближе к левому краю
	},
	title: {
		marginBottom: 32,
	},
	subtitle: {
		color: Colors.textGray,
		textAlign: 'center',
	},
	codeInput: {
		marginTop: 60,
	},
	resendContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 4,
		marginTop: 24,
	},
	resendText: {

	},
	activeResendText: {
		color: Colors.greenLink,
	},
	buttonContainer: {
		width: '100%',
		marginTop: 32,
	},
	errorText: {
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		color: Colors.error,
		marginTop: 16,
		textAlign: 'center',
	},
});
