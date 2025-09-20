import { router } from 'expo-router';
import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
	RegistrationData,
	registrationErrorAtom,
	registrationIsLoadingAtom,
	registrationStateAtom,
	submitUserDataAtom,
} from '@/features/auth-by-email';
import { citiesAtom, fetchCitiesAtom } from '@/entities/city';
import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import {
	AppButton,
	AppText,
	BackButton,
	DateInput,
	Input,
	Select,
	SelectOption,
} from '@/shared/ui';
import { StatusBarBackground } from '@/shared/ui/StatusBarBackground';

export function UserDataPage() {
	const [regState, setRegState] = useAtom(registrationStateAtom);
	const [isLoading] = useAtom(registrationIsLoadingAtom);
	const [formError, setFormError] = useAtom(registrationErrorAtom);

	const [validationErrors, setValidationErrors] = useState<
		Record<string, boolean>
	>({});

	const [cityOptions] = useAtom(citiesAtom);
	const fetchCities = useSetAtom(fetchCitiesAtom);
	const submitUserData = useSetAtom(submitUserDataAtom);

	useEffect(() => {
		fetchCities();
		// Очищаем ошибку при входе на экран
		setFormError(null);
	}, [fetchCities, setFormError]);

	const handleProceedToVerification = () => {
		// Сбрасываем предыдущие ошибки
		setValidationErrors({});
		setFormError(null);

		// Проверка заполненности обязательных полей
		const errors: Record<string, boolean> = {};
		if (!regState.firstName?.trim()) errors.firstName = true;
		if (!regState.lastName?.trim()) errors.lastName = true;
		if (!regState.city) errors.city = true;
		if (!regState.birthdate?.trim()) errors.birthdate = true;
		if (!regState.nickname?.trim()) errors.nickname = true;

		if (Object.keys(errors).length > 0) {
			setValidationErrors(errors);
			setFormError('Пожалуйста, заполните обязательные поля');
			return;
		}

		// Проверка формата даты рождения
		const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;
		if (!datePattern.test(regState.birthdate ?? '')) {
			setValidationErrors(prev => ({ ...prev, birthdate: true }));
			setFormError('Введите дату в формате ДД.ММ.ГГГГ');
			return;
		}

		submitUserData({
			onSuccess: () => {
				router.push('/verify-code');
			},
		});
	};

	const handleChange = (field: keyof RegistrationData, value: string) => {
		setRegState(prev => ({ ...prev, [field]: value }));
	};

	const handleCitySelect = (option: SelectOption) => {
		setRegState(prev => ({ ...prev, city: option.value }));
	};

	const isFormValid =
		regState.firstName?.trim() &&
		regState.lastName?.trim() &&
		regState.city &&
		regState.birthdate?.trim() &&
		regState.nickname?.trim();

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
				<View style={styles.container}>
					<View style={styles.formContainer}>
						<View style={styles.inputGroup}>
							<AppText style={styles.label}>Имя</AppText>
							<Input
								placeholder='Введите ваше имя'
								value={regState.firstName}
								onChangeText={value =>
									handleChange('firstName', value)
								}
								isInvalid={validationErrors.firstName}
								maxLength={50}
							/>
						</View>

						<View style={styles.inputGroup}>
							<AppText style={styles.label}>Фамилия</AppText>
							<Input
								placeholder='Введите вашу фамилию'
								value={regState.lastName}
								onChangeText={value =>
									handleChange('lastName', value)
								}
								isInvalid={validationErrors.lastName}
								maxLength={50}
							/>
						</View>

						<View style={styles.inputGroup}>
							<AppText style={styles.label}>Город</AppText>
							<Select
								options={cityOptions}
								value={regState.city}
								onSelect={handleCitySelect}
								placeholder='Выберите город'
								isInvalid={validationErrors.city}
							/>
						</View>

						<View style={styles.inputGroup}>
							<AppText style={styles.label}>
								Дата рождения
							</AppText>
							<DateInput
								value={regState.birthdate}
								onChangeText={value =>
									handleChange('birthdate', value)
								}
								allowFuture={false}
								isInvalid={validationErrors.birthdate}
								liveValidate={false}
								onValidityChange={isValid => {
									if (!isValid) {
										setValidationErrors(prev => ({
											...prev,
											birthdate: true,
										}));
									} else if (validationErrors.birthdate) {
										setValidationErrors(prev => ({
											...prev,
											birthdate: false,
										}));
									}
								}}
							/>
						</View>

						<View style={styles.inputGroup}>
							<AppText style={styles.label}>Ник</AppText>
							<Input
								placeholder='Введите ваш ник'
								value={regState.nickname}
								onChangeText={value =>
									handleChange('nickname', value)
								}
								isInvalid={validationErrors.nickname}
								autoCapitalize='none'
								maxLength={30}
							/>
						</View>
					</View>

					{formError && (
						<AppText style={styles.errorText}>{formError}</AppText>
					)}

					<View style={styles.buttonContainer}>
						<AppButton
							text='Зарегистрироваться'
							onPress={handleProceedToVerification}
							isLoading={isLoading}
							disabled={!isFormValid || isLoading}
							style={styles.appButton}
							buttonBorderRadius={Radius.r22}
						/>
					</View>
				</View>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	appButton: {
		height: 54,
	},
	backButton: {
		left: 16,
		position: 'absolute',
		top: 16,
		zIndex: 1,
	},
	buttonContainer: {
		marginTop: 20,
		paddingBottom: 20,
	},

	container: {
		flex: 1,
		justifyContent: 'center',
		paddingVertical: 80,
	},

	errorText: {
		color: Colors.error,
		fontSize: Fonts.f14,
		marginTop: 16,
		textAlign: 'center',
	},
	formContainer: {
		gap: Gaps.g16,
		marginBottom: 20,
	},
	inputGroup: {
		gap: Gaps.g8,
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
});
