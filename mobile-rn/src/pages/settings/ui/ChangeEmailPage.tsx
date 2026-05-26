import { router } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppButton, AppText, BackButton, Input } from '@/shared/ui';
import { StatusBarBackground } from '@/shared/ui/StatusBarBackground';

import { useRequestEmailChange } from '../model/hooks';

export function ChangeEmailPage() {
	const { newEmail, setNewEmail, requestChange, isLoading, error, setError } =
		useRequestEmailChange();

	useEffect(() => {
		setError(null);
	}, [setError]);

	const handleNext = () => {
		requestChange({
			onSuccess: () => {
				router.push('/settings/verify-email-change');
			},
		});
	};

	const setEmail = (email: string) => {
		setNewEmail(email);
		if (error) {
			setError(null);
		}
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
			<KeyboardAwareScrollView
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps='handled'
			>
				<View style={styles.content}>
					<View style={styles.headerBlock}>
						<AppText variant='h1' style={styles.title}>
							Изменение почты
						</AppText>
					</View>
					<View style={styles.formContainer}>
						<View style={styles.inputGroup}>
							<AppText style={styles.label}>E-mail</AppText>
							<Input
								placeholder='Введите новую эл.почту'
								value={newEmail}
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
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	appButton: { height: 54 },
	backButton: {
		left: 16,
		position: 'absolute',
		zIndex: 1,
	},
	content: { flex: 1 },
	errorText: {
		color: Colors.error,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		marginTop: 16,
		textAlign: 'center',
	},
	formContainer: { gap: 32 },
	headerBlock: { alignItems: 'center', marginBottom: 100 },
	inputGroup: { gap: 12 },
	label: { fontFamily: Fonts.medium, marginLeft: 16 },
	safeArea: { backgroundColor: Colors.lightBackground, flex: 1 },
	scrollContainer: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 60 },
	title: {
		marginTop: 102,
	},
});
