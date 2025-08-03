import { citiesAtom, fetchCitiesAtom } from '@/entities/city';
import {
	RegistrationData,
	registrationErrorAtom,
	registrationIsLoadingAtom,
	registrationStateAtom,
	submitUserDataAtom,
} from '@/features/auth-by-email';
import { Colors, Fonts, Gaps } from '@/shared/tokens';
import {
	AppButton,
	AppText,
	BackButton,
	Input,
	Select,
	SelectOption,
} from '@/shared/ui';
import { router } from 'expo-router';
import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

	const formatBirthdate = (text: string) => {
		const cleaned = text.replace(/\D/g, '');
		if (cleaned.length <= 2) return cleaned;
		if (cleaned.length <= 4)
			return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
		return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.${cleaned.slice(
			4,
			8,
		)}`;
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
			<StatusBar
				barStyle='dark-content'
				backgroundColor={Colors.lightBackground}
			/>

			<BackButton style={[styles.backButton, { top: backButtonTop }]} />
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
							<Input
								placeholder='DD.MM.YYYY'
								value={regState.birthdate}
								onChangeText={text =>
									handleChange(
										'birthdate',
										formatBirthdate(text),
									)
								}
								keyboardType='numeric'
								maxLength={10}
								isInvalid={validationErrors.birthdate}
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
						/>
					</View>
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
	container: {
		flex: 1,
		paddingVertical: 80,
		justifyContent: 'center',
	},

	backButton: {
		position: 'absolute',
		top: 16,
		left: 16,
		zIndex: 1,
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
	buttonContainer: {
		marginTop: 20,
		paddingBottom: 20,
	},
	errorText: {
		fontSize: Fonts.f14,
		color: Colors.error,
		marginTop: 16,
		textAlign: 'center',
	},
});
