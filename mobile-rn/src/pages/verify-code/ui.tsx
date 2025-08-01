import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useResendCode, useVerifyCode } from '@/src/features/verify-code';
import { SessionStorage } from '@/src/entities/session';
import { Colors, Fonts } from '@/src/shared/tokens';
import { AppButton, BackButton, CodeInput } from '@/src/shared/ui';

export function VerifyCodePage() {
	const [code, setCode] = useState('');
	const [timeLeft, setTimeLeft] = useState(60);
	const [canResend, setCanResend] = useState(false);
	const [email, setEmail] = useState('');
	const { verifyCode, isLoading, error } = useVerifyCode();
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
		if (!canResend) return;

		try {
			await resendCode();
			setTimeLeft(60);
			setCanResend(false);
		} catch (err) {
			console.error('Ошибка при повторной отправке кода', err);
		}
	};

	const handleVerifyCode = async () => {
		if (!code || code.length < 4) return;

		try {
			await verifyCode(code);
			// Маршрутизация происходит внутри хука useVerifyCode
		} catch (err) {
			console.error('Ошибка при проверке кода', err);
		}
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
					<Text style={styles.title}>Код подтверждения</Text>
					<Text style={styles.subtitle}>
						Введите код, отправленный на {email || 'эл. почту'}
					</Text>
				</View>

				<CodeInput
					value={code}
					onChangeText={setCode}
					length={4}
					autoFocus
					isError={!!error}
					style={styles.codeInput}
				/>
				<View style={styles.resendContainer}>
					<TouchableOpacity
						disabled={!canResend}
						onPress={handleResendCode}
						activeOpacity={0.7}
					>
						<Text
							style={[
								styles.resendText,
								canResend && styles.activeResendText,
							]}
						>
							Отправить снова
						</Text>
					</TouchableOpacity>

					{!canResend && (
						<Text style={styles.resendText}>
							через {formatTime(timeLeft)}
						</Text>
					)}
				</View>

				<View style={styles.buttonContainer}>
					<AppButton
						text='Далее'
						onPress={handleVerifyCode}
						isLoading={isLoading}
						disabled={code.length < 4}
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
		fontFamily: Fonts.bold,
		fontSize: 32,
		color: Colors.headerAndInputText,
		marginBottom: 32,
		textAlign: 'center',
	},
	subtitle: {
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
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
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
		color: Colors.placeholderGray,
	},
	activeResendText: {
		color: Colors.linkGreen,
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
