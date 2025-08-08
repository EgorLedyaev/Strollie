import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
	citiesAtom,
	citiesIsLoadingAtom,
	fetchCitiesAtom,
} from '@/entities/city';
import { type User } from '@/entities/user';
import { Colors, Fonts, Gaps, Radius, Sizes } from '@/shared/tokens';
import {
	AppButton,
	AppText,
	BackButton,
	Input,
	Select,
	type SelectOption,
} from '@/shared/ui';

import { AvatarUploader } from './AvatarUploader';
import { ProfileEditOverlay } from './ProfileEditOverlay';

export interface UserProfileData {
	firstName: string;
	lastName: string;
	nickname: string;
	city: string;
	birthDate: string;
	photo?: string;
}

interface EditProfileFormProps {
	user: User;
	onSave: (userData: UserProfileData) => void;
	isSaving: boolean;
	onBackPress: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
	user,
	onSave,
	isSaving,
	onBackPress,
}) => {
	const [cityOptions] = useAtom(citiesAtom);
	const [isLoadingCities] = useAtom(citiesIsLoadingAtom);
	const fetchCities = useSetAtom(fetchCitiesAtom);

	const [visible, setVisible] = useState(false);

	useEffect(() => {
		fetchCities();
	}, [fetchCities]);

	// Инициализируем локальное состояние из user один раз
	const initialData = useMemo(
		() => ({
			firstName: user.firstName || '',
			lastName: user.lastName || '',
			nickname: user.nickname || '',
			city: user.city || '',
			birthDate: user.birthDate || '',
			photo: user.photo,
		}),
		[user.user_id],
	);

	const [userData, setUserData] = useState<UserProfileData>(initialData);

	useEffect(() => {
		setUserData(initialData);
	}, [initialData]);

	const handleChange = (field: keyof UserProfileData, value: string) => {
		setUserData(prev => ({ ...prev, [field]: value }));
	};

	const handleCitySelect = (option: SelectOption) => {
		handleChange('city', option.value);
	};

	const handleAvatarChange = (uri: string | null) => {
		if (uri) {
			handleChange('photo', uri);
		}
	};

	const handleSave = () => {
		onSave(userData);
	};

	const formatBirthdate = (text: string) => {
		const cleaned = text.replace(/\D/g, '');
		let formatted = cleaned;
		if (cleaned.length > 4) {
			formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.${cleaned.slice(4, 8)}`;
		} else if (cleaned.length > 2) {
			formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
		}
		handleChange('birthDate', formatted);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View></View>
			<View style={styles.header}>
				<BackButton variant='icon' onPress={onBackPress} />

				<AppText variant='header'>Редактирование</AppText>
				<View style={styles.placeHolder} />
			</View>

			<KeyboardAwareScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<AvatarUploader onAvatarChange={handleAvatarChange} />
				<AppText style={styles.fullName}>
					{user.firstName} {user.lastName}
				</AppText>

				<View style={styles.form}>
					<View style={styles.field}>
						<AppText style={styles.label}>Имя</AppText>
						<Input
							value={userData.firstName}
							onChangeText={value =>
								handleChange('firstName', value)
							}
						/>
					</View>
					<View style={styles.field}>
						<AppText style={styles.label}>Фамилия</AppText>
						<Input
							value={userData.lastName}
							onChangeText={value =>
								handleChange('lastName', value)
							}
						/>
					</View>
					<View style={styles.field}>
						<AppText style={styles.label}>Никнейм</AppText>
						<Input
							value={userData.nickname}
							onChangeText={value =>
								handleChange('nickname', value)
							}
						/>
					</View>
					<View style={styles.field}>
						<AppText style={styles.label}>Город</AppText>
						<Select
							options={cityOptions}
							value={userData.city}
							onSelect={handleCitySelect}
							placeholder={
								isLoadingCities
									? 'Загрузка...'
									: 'Выберите город'
							}
						/>
					</View>
					<View style={styles.field}>
						<AppText style={styles.label}>Дата рождения</AppText>
						<Input
							value={userData.birthDate}
							onChangeText={formatBirthdate}
							placeholder='ДД.ММ.ГГГГ'
							keyboardType='numeric'
							maxLength={10}
						/>
					</View>
				</View>
			</KeyboardAwareScrollView>
			<View style={styles.footer}>
				<AppButton
					text='Сохранить изменения'
					onPress={() => setVisible(true)}
					style={styles.buttonContent}
					buttonBorderRadius={Radius.r15}
				/>
			</View>
			<ProfileEditOverlay
				visible={visible}
				onClose={() => setVisible(false)}
				onSave={handleSave}
				isLoading={isSaving}
				onCancel={() => setVisible(false)}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
	},

	header: {
		flexDirection: 'row',
		paddingTop: 10,
		paddingBottom: 20,
		alignItems: 'center',
		justifyContent: 'space-between',
	},

	placeHolder: {
		width: Sizes.button.sm,
	},

	scrollContent: {
		paddingBottom: 20,
	},
	fullName: {
		textAlign: 'center',
		fontSize: Fonts.f20,
		fontFamily: Fonts.semibold,
		marginTop: 10,
		marginBottom: 20,
	},
	form: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		padding: 20,
		gap: Gaps.g16,
	},
	field: {
		gap: Gaps.g8,
	},
	label: {
		fontFamily: Fonts.medium,
		fontSize: Fonts.f14,
		color: Colors.darkGray,
		paddingLeft: 16,
	},
	footer: {
		borderTopColor: Colors.gray,
		paddingBottom: 40,
	},
	buttonContent: {
		height: 44,
	},
});
