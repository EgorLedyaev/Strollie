import { router } from 'expo-router';
import { useAtom, useAtomValue } from 'jotai';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useResendCode } from '@/features/auth-by-email';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import {
	ActionTouchable,
	AppButton,
	AppText,
	BackButton,
	CodeInput,
} from '@/shared/ui';
import { StatusBarBackground } from '@/shared/ui/StatusBarBackground';

import { newEmailAtom, verifyChangeErrorAtom } from '../model/atoms';
import { useVerifyEmailChange } from '../model/hooks';

export function VerifyEmailChangePage() {
	const [code, setCode] = useState('');
	const [error, setError] = useAtom(verifyChangeErrorAtom);
	const [timeLeft, setTimeLeft] = useState(60);
	const [canResend, setCanResend] = useState(false);
	const { verifyCode, isLoading } = useVerifyEmailChange();
	const { resendCode, isLoading: isResending } = useResendCode({
		email: newEmail ?? undefined,
	});
	const newEmail = useAtomValue(newEmailAtom);

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
		if (!canResend || isResending) return;
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
		setError(null);

		verifyCode(code, {
			onSuccess: () => {
				router.replace('/(app)/settings');
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
			<StatusBarBackground color={Colors.lightBackground} />
			<SystemBars style='dark' />

			<BackButton
				style={[styles.backButton, { top: backButtonTop }]}
				onPress={() => router.back()}
			/>

			<View style={styles.container}>
				<View style={styles.header}>
					<AppText variant='h1' style={styles.title}>
						Код подтверждения
					</AppText>
					<AppText style={styles.subtitle}>
						Введите код, отправленный на{' '}
						{newEmail || 'новую эл. почту'}
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
					<ActionTouchable
						disabled={!canResend}
						onPress={handleResendCode}
						feedback='opacity'
					>
						<AppText
							style={[
								styles.resendText,
								canResend && styles.activeResendText,
							]}
						>
							{isResending ? 'Отправка...' : 'Отправить снова'}
						</AppText>
					</ActionTouchable>

					{!canResend && (
						<AppText style={styles.resendText}>
							через {formatTime(timeLeft)}
						</AppText>
					)}
				</View>

				<View style={styles.buttonContainer}>
					<AppButton
						text='Подтвердить'
						onPress={handleVerifyCode}
						isLoading={isLoading}
						disabled={code.length < 4 || isLoading}
						style={styles.appButton}
						buttonBorderRadius={Radius.r22}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	activeResendText: {
		color: Colors.greenLink,
	},
	appButton: {
		height: 54,
	},
	backButton: {
		left: 16,
		position: 'absolute',
		top: 16,
	},
	buttonContainer: {
		marginTop: 32,
		width: '100%',
	},
	codeInput: {
		marginTop: 60,
	},
	container: {
		alignItems: 'center',
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 80,
	},
	errorText: {
		color: Colors.error,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		marginTop: 16,
		textAlign: 'center',
	},
	header: {
		alignItems: 'center',
		marginTop: 85,
		width: '100%',
	},
	resendContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 4,
		justifyContent: 'center',
		marginTop: 24,
	},
	resendText: {},
	safeArea: {
		backgroundColor: Colors.lightBackground,
		flex: 1,
	},
	subtitle: {
		color: Colors.secondaryText,
		textAlign: 'center',
	},
	title: {
		marginBottom: 32,
	},
});
