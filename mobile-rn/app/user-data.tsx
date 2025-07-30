import { useAuth } from '@/src/entities/auth/model/auth-context';
import { AppButton } from '@/src/shared/Button/AppButton';
import { Input } from '@/src/shared/Input/Input';
import { Colors, Fonts } from '@/src/shared/tokens';
import { BackButton } from '@/src/shared/ui/BackButton';
import { Select, SelectOption } from '@/src/shared/ui/Select';
import { router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function UserData() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [city, setCity] = useState('');
	const [birthdate, setBirthdate] = useState('');
	const [nickname, setNickname] = useState('');
	const [validationErrors, setValidationErrors] = useState<
		Record<string, boolean>
	>({});
	const [formError, setFormError] = useState<string | null>(null);

	const { register, isLoading, error } = useAuth();

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

			// Отправка данных для регистрации
			await register({
				firstName,
				lastName,
				city,
				birthdate,
				nickname,
			});

			// Переход на главный экран после успешной регистрации
			router.replace('/(app)');
		} catch (err) {
			console.error('Ошибка регистрации', err);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar
				barStyle='dark-content'
				backgroundColor={Colors.lightBackground}
			/>

			<BackButton style={styles.backButton} />

			<View style={styles.container}>

				<View style={styles.formContainer}>
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Имя</Text>
						<Input
							placeholder='Введите свое имя'
							value={firstName}
							onChangeText={text => {
								setFirstName(text);
								if (validationErrors.firstName) {
									setValidationErrors({
										...validationErrors,
										firstName: false,
									});
								}
							}}
							autoCapitalize='words'
							isInvalid={validationErrors.firstName}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Фамилия</Text>
						<Input
							placeholder='Введите свою фамилию'
							value={lastName}
							onChangeText={text => {
								setLastName(text);
								if (validationErrors.lastName) {
									setValidationErrors({
										...validationErrors,
										lastName: false,
									});
								}
							}}
							autoCapitalize='words'
							isInvalid={validationErrors.lastName}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Город</Text>
						<Select
							options={cityOptions}
							value={city}
							placeholder='Введите город'
							onSelect={option => {
								console.log('User-data received selection:', option);
								// Явно устанавливаем город на основе значения выбранной опции
								setCity(option.value);
								// Сбрасываем ошибку валидации, если она была
								if (validationErrors.city) {
									setValidationErrors({
										...validationErrors,
										city: false,
									});
								}
							}}
							isInvalid={validationErrors.city}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Дата рождения</Text>
						<Input
							placeholder='Введите дату рождения'
							value={birthdate}
							onChangeText={text => {
								setBirthdate(text);
								if (validationErrors.birthdate) {
									setValidationErrors({
										...validationErrors,
										birthdate: false,
									});
								}
							}}
							keyboardType='numbers-and-punctuation'
							isInvalid={validationErrors.birthdate}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Введите никнейм</Text>
						<Input
							placeholder='abcdef2001'
							value={nickname}
							onChangeText={text => {
								setNickname(text);
								if (validationErrors.nickname) {
									setValidationErrors({
										...validationErrors,
										nickname: false,
									});
								}
							}}
							isInvalid={validationErrors.nickname}
						/>
					</View>
				</View>

				{(error || formError) && (
					<Text style={styles.errorText}>{formError || error}</Text>
				)}

				<View style={styles.buttonContainer}>
					<AppButton
						text='Зарегистрироваться'
						onPress={handleRegister}
						isLoading={isLoading}
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
        paddingBottom: 20,
        marginTop: 80,
	},
	backButton: {
		position: 'absolute',
		top: 16, // Ближе к верхнему краю
		left: 16, // Ближе к левому краю
		zIndex: 10,
	},
	formContainer: {
		gap: 24,
		marginTop: 20,
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
	buttonContainer: {
		marginTop: 32,
	},
});
