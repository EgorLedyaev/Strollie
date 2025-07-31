import { Colors, Fonts } from '@/src/shared/tokens';
import {
	AppButton,
	BackButton,
	Input,
	Select,
	SelectOption,
} from '@/src/shared/ui';
import { router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRegisterUser } from '@/src/features/register-user';

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

	const { register, isLoading, error } = useRegisterUser();

	const cityOptions: SelectOption[] = [
		{ label: 'г. Москва, Московская обл.', value: 'moscow' },
		{ label: 'г. Санкт-Петербург, Ленинградская обл.', value: 'spb' },
		{ label: 'г. Екатеринбург, Свердловская обл.', value: 'ekb' },
		{ label: 'г. Новосибирск, Новосибирская обл.', value: 'nsk' },
		{ label: 'г. Казань, Республика Татарстан', value: 'kazan' },
		{ label: 'г. Самара, Самарская обл.', value: 'samara' },
		{ label: 'г. Саратов, Саратовская обл.', value: 'saratov' },
	];

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

			<View style={styles.container}>
				<View style={styles.formContainer}>
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Имя</Text>
						<Input
							placeholder='Введите ваше имя'
							value={firstName}
							onChangeText={setFirstName}
							isInvalid={validationErrors.firstName}
							maxLength={50}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Фамилия</Text>
						<Input
							placeholder='Введите вашу фамилию'
							value={lastName}
							onChangeText={setLastName}
							isInvalid={validationErrors.lastName}
							maxLength={50}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Город</Text>
						<Select
							options={cityOptions}
							value={city}
							onSelect={handleCitySelect}
							placeholder='Выберите город'
							isInvalid={validationErrors.city}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Дата рождения</Text>
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
						<Text style={styles.label}>Ник</Text>
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
					<Text style={styles.errorText}>{formError || error}</Text>
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
	},
	header: {
		alignItems: 'center',
		marginTop: 70,
		marginBottom: 60,
	},
	backButton: {
		position: 'absolute',
		top: 16,
		left: 16,
	},
	title: {
		fontFamily: Fonts.bold,
		fontSize: 24,
		color: Colors.inputText,
		marginBottom: 16,
		textAlign: 'center',
	},
	subtitle: {
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
		color: Colors.textGray,
		textAlign: 'center',
	},
	formContainer: {
		gap: 12,
		marginBottom: 20,
	},
	inputGroup: {
		// gap: 0,
	},
	label: {
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
		color: Colors.inputText,
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
