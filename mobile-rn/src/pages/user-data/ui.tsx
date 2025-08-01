import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



import { useRegisterUser } from '@/src/features/register-user';
import { citiesAtom, citiesIsLoadingAtom, fetchCitiesAtom } from '@/src/entities/city';
import { Colors, Fonts, Gaps } from '@/src/shared/tokens';
import { AppButton, AppText, BackButton, Input, Select, SelectOption } from '@/src/shared/ui';





export function UserDataPage() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [city, setCity] = useState('');
	const [birthdate, setBirthdate] = useState('');
	const [nickname, setNickname] = useState('');
	const [validationErrors, setValidationErrors] = useState<
		Record<string, boolean>
	>({});
	const [formError, setFormError] = useState<string | null>(null);

	const [cityOptions] = useAtom(citiesAtom);
	const [isLoadingCities] = useAtom(citiesIsLoadingAtom);
	const fetchCities = useSetAtom(fetchCitiesAtom);

	const { register, isLoading, error } = useRegisterUser();

	useEffect(() => {
		fetchCities();
	}, [fetchCities]);

	const handleRegister = async () => {
		try {
			// Сбрасываем предыдущие ошибки
			setValidationErrors({});
			setFormError(null);

			// Проверка заполненности обязательных полей
			const errors: Record<string, boolean> = {};
			if (!firstName.trim()) errors.firstName = true;
			if (!lastName.trim()) errors.lastName = true;
			if (!city) errors.city = true;
			if (!birthdate.trim()) errors.birthdate = true;
			if (!nickname.trim()) errors.nickname = true;

			if (Object.keys(errors).length > 0) {
				setValidationErrors(errors);
				setFormError('Пожалуйста, заполните обязательные поля');
				return;
			}

			// Валидация формата даты (DD.MM.YYYY)
			const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
			if (!dateRegex.test(birthdate)) {
				setValidationErrors({ birthdate: true });
				setFormError(
					'Некорректный формат даты. Используйте DD.MM.YYYY',
				);
				return;
			}

			// Отправляем данные
			await register({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				city,
				birthdate: birthdate.trim(),
				nickname: nickname.trim(),
			});

			// Навигация произойдет через хук после успешной регистрации
		} catch (error: any) {
			console.error('Ошибка регистрации:', error);
			setFormError(
				error.message || 'Ошибка при регистрации пользователя',
			);
		}
	};

	const handleCitySelect = (option: SelectOption) => {
		setCity(option.value);
	};

	const isFormValid =
		firstName.trim() &&
		lastName.trim() &&
		city &&
		birthdate.trim() &&
		nickname.trim();

	const formatBirthdate = (text: string) => {
		// Удаляем все, кроме цифр
		const cleaned = text.replace(/\D/g, '');

		// Добавляем точки автоматически
		if (cleaned.length <= 2) {
			return cleaned;
		} else if (cleaned.length <= 4) {
			return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
		} else {
			return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.${cleaned.slice(
				4,
				8,
			)}`;
		}
	};

	const handleBirthdateChange = (text: string) => {
		const formatted = formatBirthdate(text);
		setBirthdate(formatted);
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
								value={firstName}
								onChangeText={setFirstName}
								isInvalid={validationErrors.firstName}
								maxLength={50}
							/>
						</View>

						<View style={styles.inputGroup}>
							<AppText style={styles.label}>Фамилия</AppText>
							<Input
								placeholder='Введите вашу фамилию'
								value={lastName}
								onChangeText={setLastName}
								isInvalid={validationErrors.lastName}
								maxLength={50}
							/>
						</View>

						<View style={styles.inputGroup}>
							<AppText style={styles.label}>Город</AppText>
							<Select
								options={cityOptions}
								value={city}
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
								value={birthdate}
								onChangeText={handleBirthdateChange}
								keyboardType='numeric'
								maxLength={10}
								isInvalid={validationErrors.birthdate}
							/>
						</View>

						<View style={styles.inputGroup}>
							<AppText style={styles.label}>Ник</AppText>
							<Input
								placeholder='Введите ваш ник'
								value={nickname}
								onChangeText={setNickname}
								isInvalid={validationErrors.nickname}
								autoCapitalize='none'
								maxLength={30}
							/>
						</View>
					</View>

					{(formError || error) && (
						<AppText style={styles.errorText}>
							{formError || error}
						</AppText>
					)}

					<View style={styles.buttonContainer}>
						<AppButton
							text='Завершить регистрацию'
							onPress={handleRegister}
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
		fontSize: Fonts.f16,
		color: Colors.headerAndInputText,
		marginLeft: 16,
	},
	buttonContainer: {
		marginTop: 20,
		paddingBottom: 20,
	},
	errorText: {
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		color: Colors.error,
		marginTop: 16,
		textAlign: 'center',
	},
});