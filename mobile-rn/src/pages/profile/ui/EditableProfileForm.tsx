import { profileAtom, UserProfileStorage } from '@/entities/user';
import { SaveProfileButton } from '@/features/edit-profile';
import { Colors } from '@/shared/tokens';
import { AppButton, AppText, Input } from '@/shared/ui';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

// Определяем интерфейс локально вместо импорта из pages
export interface UserProfileData {
	firstName: string;
	lastName: string;
	nickname: string;
	city: string;
	birthDate: string;
}

interface EditableProfileFormProps {
	initialData: UserProfileData;
	onCancel: () => void;
}

export const EditableProfileForm: React.FC<EditableProfileFormProps> = ({
	initialData,
	onCancel,
}) => {
	const [formData, setFormData] = useState(initialData);
	const [profileState, setProfileState] = useAtom(profileAtom);

	const handleChange = (field: keyof UserProfileData, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleSave = async () => {
		try {
			// Обновляем локальное хранилище
			await UserProfileStorage.saveUserProfile(formData);

			// Обновляем атом состояния
			if (profileState.profile) {
				setProfileState({
					...profileState,
					profile: {
						...profileState.profile,
						firstName: formData.firstName,
						lastName: formData.lastName,
						nickname: formData.nickname,
						city: formData.city,
						birthDate: formData.birthDate,
					},
				});
			}

			// Возвращаемся на экран профиля
			onCancel();
		} catch (error) {
			console.error('Ошибка при сохранении профиля:', error);
		}
	};

	return (
		<View style={styles.container}>
			<AppText style={styles.title}>Редактирование профиля</AppText>

			<View style={styles.form}>
				<View style={styles.inputContainer}>
					<AppText style={styles.label}>Имя</AppText>
					<Input
						value={formData.firstName}
						onChangeText={value => handleChange('firstName', value)}
						placeholder='Введите имя'
						style={styles.input}
					/>
				</View>

				<View style={styles.inputContainer}>
					<AppText style={styles.label}>Фамилия</AppText>
					<Input
						value={formData.lastName}
						onChangeText={value => handleChange('lastName', value)}
						placeholder='Введите фамилию'
						style={styles.input}
					/>
				</View>

				<View style={styles.inputContainer}>
					<AppText style={styles.label}>Никнейм</AppText>
					<Input
						value={formData.nickname}
						onChangeText={value => handleChange('nickname', value)}
						placeholder='Введите никнейм'
						style={styles.input}
					/>
				</View>

				<View style={styles.inputContainer}>
					<AppText style={styles.label}>Город</AppText>
					<Input
						value={formData.city}
						onChangeText={value => handleChange('city', value)}
						placeholder='Введите город'
						style={styles.input}
					/>
				</View>

				<View style={styles.inputContainer}>
					<AppText style={styles.label}>Дата рождения</AppText>
					<Input
						value={formData.birthDate}
						onChangeText={value => handleChange('birthDate', value)}
						placeholder='ДД.ММ.ГГГГ'
						style={styles.input}
					/>
				</View>
			</View>

			<View style={styles.buttons}>
				<AppButton
					text='Отмена'
					onPress={onCancel}
					variant='secondary'
					style={styles.cancelButton}
				/>
				<SaveProfileButton onPress={handleSave} isDisabled={false} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 24,
		color: Colors.black,
	},
	form: {
		marginBottom: 20,
	},
	inputContainer: {
		marginBottom: 16,
	},
	label: {
		marginBottom: 4,
		fontSize: 16,
		fontWeight: '500',
		color: Colors.black,
	},
	input: {
		marginBottom: 0,
	},
	buttons: {
		marginTop: 16,
	},
	cancelButton: {
		marginBottom: 12,
	},
});
