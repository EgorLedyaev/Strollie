import ArrowLeftIcon from '@/assets/icons/arrow-left';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type User } from '@/src/entities/user';
import { Colors, Fonts, Radius } from '@/src/shared/tokens';
import { AppButton, Select, type SelectOption } from '@/src/shared/ui';

import { ProfileField } from './ProfileField';

interface EditProfileProps {
	user: User;
	onSave: (userData: UserProfileData) => void;
}

export interface UserProfileData {
	firstName: string;
	lastName: string;
	middleName: string;
	nickname: string;
	city: string;
	birthDate: string;
	aboutMe?: string;
}

export const EditProfileScreen: React.FC<EditProfileProps> = ({
	user,
	onSave,
}) => {
	const navigation = useNavigation();

	// Опции для выбора города
	const cityOptions: SelectOption[] = [
		{ label: 'Калининград', value: 'kaliningrad' },
		{ label: 'Москва', value: 'moscow' },
		{ label: 'г. Санкт-Петербург, Ленинградская обл.', value: 'spb' },
		{ label: 'г. Екатеринбург, Свердловская обл.', value: 'ekb' },
		{ label: 'Казань', value: 'kazan' },
		{ label: 'Нижний Новгород', value: 'nizhny-novgorod' },
		{ label: 'Челябинск', value: 'chelyabinsk' },
		{ label: 'Самара', value: 'samara' },
		{ label: 'Омск', value: 'omsk' },
		{ label: 'Ростов-на-Дону', value: 'rostov-on-don' },
		{ label: 'Уфа', value: 'ufa' },
		{ label: 'Красноярск', value: 'krasnoyarsk' },
		{ label: 'Новосибирск', value: 'novosibirsk' },
		{ label: 'Пермь', value: 'perm' },
		{ label: 'Воронеж', value: 'voronezh' },
		{ label: 'Волгоград', value: 'volgograd' },
	];

	// Начальные данные из пользовательского профиля или заглушка
	const [userData, setUserData] = useState<UserProfileData>({
		firstName: user.firstName || '',
		lastName: user.lastName || '',
		middleName: user.middleName || '',
		nickname: user.nickname || user.email || '',
		city: user.city || '',
		birthDate: user.birthDate || '',
		aboutMe: user.aboutMe || '',
	});

	const handleChange = (field: keyof UserProfileData, value: string) => {
		setUserData(prev => ({ ...prev, [field]: value }));
	};

	const handleCitySelect = (option: SelectOption) => {
		setUserData(prev => ({ ...prev, city: option.value }));
	};

	// Найти текущее значение города в опциях и выбранный город для отображения
	const currentCityValue = userData.city;

	// Найдем название города для отображения
	const currentCityLabel =
		cityOptions.find(opt => opt.value === currentCityValue)?.label ||
		'Выберите город';

	const handleSave = () => {
		console.log(
			'Нажата кнопка Сохранить: сохраняем данные пользователя',
			userData,
		);
		onSave(userData);
		// Не используем navigation.goBack() так как onSave сам переключает состояние на экране профиля
	};

	const handleGoBack = () => {
		// Просто возвращаемся назад без сохранения изменений
		console.log(
			'Нажата кнопка Назад: возвращаемся без сохранения изменений',
		);
		navigation.goBack();
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={handleGoBack}
					style={styles.backButton}
				>
					<ArrowLeftIcon />
				</TouchableOpacity>
				<Text style={styles.title}>Редактирование</Text>
				<View style={styles.placeholder} />
			</View>

			<View style={styles.avatarContainer}>
				<View style={styles.avatar}></View>
			</View>

			<KeyboardAwareScrollView style={styles.formContainer}>
				<View style={styles.formContent}>
					<ProfileField
						label='Имя'
						value={userData.firstName}
						onChangeText={value => handleChange('firstName', value)}
					/>

					<ProfileField
						label='Фамилия'
						value={userData.lastName}
						onChangeText={value => handleChange('lastName', value)}
					/>

					<ProfileField
						label='Отчество'
						value={userData.middleName}
						onChangeText={value =>
							handleChange('middleName', value)
						}
					/>

					<ProfileField
						label='Никнейм'
						value={userData.nickname}
						onChangeText={value => handleChange('nickname', value)}
					/>

					<View style={styles.cityFieldContainer}>
						<Text style={styles.cityLabel}>Город</Text>
						<Select
							options={cityOptions}
							value={currentCityValue}
							onSelect={handleCitySelect}
							placeholder='Выберите город'
							key={`city-select-${currentCityValue || 'default'}`} /* Используем значение города как ключ вместо случайного числа */
						/>
					</View>

					<ProfileField
						label='Дата рождения'
						value={userData.birthDate}
						onChangeText={value => {
							// Форматируем дату в формат ДД.ММ.ГГГГ
							const cleaned = value.replace(/[^0-9.]/g, '');
							let formatted = '';

							// Удаляем все точки и строим формат заново
							const digits = cleaned.replace(/\./g, '');

							if (digits.length > 0) {
								formatted += digits.substring(
									0,
									Math.min(2, digits.length),
								);
							}
							if (digits.length > 2) {
								formatted +=
									'.' +
									digits.substring(
										2,
										Math.min(4, digits.length),
									);
							}
							if (digits.length > 4) {
								formatted +=
									'.' +
									digits.substring(
										4,
										Math.min(8, digits.length),
									);
							}

							handleChange('birthDate', formatted);
						}}
						placeholder='ДД.ММ.ГГГГ'
						keyboardType='numeric'
						maxLength={10}
					/>

					<ProfileField
						label='О себе'
						value={userData.aboutMe || ''}
						onChangeText={value => handleChange('aboutMe', value)}
						multiline
						numberOfLines={4}
					/>
				</View>
			</KeyboardAwareScrollView>

			<View style={styles.buttonContainer}>
				<AppButton text='Сохранить изменения' onPress={handleSave} />
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightBackground,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingTop: 10,
		paddingBottom: 20,
	},
	backButton: {
		padding: 5,
	},
	placeholder: {
		width: 24,
	},
	title: {
		fontFamily: Fonts.bold,
		fontSize: 16,
		color: Colors.black,
	},
	avatarContainer: {
		alignItems: 'center',
		marginBottom: 20,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: Colors.gray,
	},
	formContainer: {
		flex: 1,
	},
	formContent: {
		backgroundColor: Colors.white,
		margin: 10,
		borderRadius: Radius.r15,
		padding: 10,
	},
	buttonContainer: {
		padding: 16,
	},
	cityFieldContainer: {
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: Colors.inputBorder,
	},
	cityLabel: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.darkGray,
		marginBottom: 5,
	},
});
