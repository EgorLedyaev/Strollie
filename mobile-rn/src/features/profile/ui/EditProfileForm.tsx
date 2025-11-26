import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCitiesQuery } from '@/entities/city';
import { type User } from '@/entities/user';
import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppButton, AppText, Input, Select } from '@/shared/ui';

import { profileSchema, type ProfileSchema } from '../model/schema';
import { AvatarUploader } from './AvatarUploader';
import { ProfileEditOverlay } from './ProfileEditOverlay';

export interface UserProfileData {
	firstName: string;
	lastName: string;
	nickname: string;
	email: string;
	city: string;
	birthDate: string;
	photo?: string;
}

interface EditProfileFormProps {
	user: User;
	onSave: (userData: UserProfileData) => void;
	isSaving: boolean;
	headerSlot?: ReactNode;
}

export function EditProfileForm({
	user,
	onSave,
	isSaving,
	headerSlot,
}: EditProfileFormProps) {
	const {
		data: cityOptions = [],
		isPending: isLoadingCities,
		isRefetching,
	} = useCitiesQuery();

	const [visible, setVisible] = useState(false);

	const defaultValues = useMemo(
		() => ({
			firstName: user.firstName || '',
			lastName: user.lastName || '',
			nickname: user.nickname || '',
			email: user.email || '',
			city: user.city || '',
			birthDate: user.birthDate || '',
			photo: user.photo,
		}),
		[user],
	);

	const { control, handleSubmit, reset } = useForm<ProfileSchema>({
		resolver: zodResolver(profileSchema),
		defaultValues,
		mode: 'onChange',
	});

	useEffect(() => {
		reset(defaultValues);
	}, [defaultValues, reset]);

	const handleSave = (data: ProfileSchema) => {
		onSave(data as UserProfileData);
		setVisible(false);
	};

	const formatBirthdate = (text: string) => {
		const cleaned = text.replace(/\D/g, '');
		let formatted = cleaned;
		if (cleaned.length > 4) {
			formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.${cleaned.slice(4, 8)}`;
		} else if (cleaned.length > 2) {
			formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
		}
		return formatted;
	};

	return (
		<SafeAreaView style={styles.container}>
			{headerSlot ? (
				<View style={styles.header}>{headerSlot}</View>
			) : null}

			<KeyboardAwareScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<Controller
					control={control}
					name='photo'
					render={({ field: { onChange, value } }) => (
						<AvatarUploader
							onAvatarChange={uri => onChange(uri)}
							value={value}
						/>
					)}
				/>

				<View style={styles.form}>
					<View style={styles.field}>
						<AppText style={styles.label}>Имя</AppText>
						<Controller
							control={control}
							name='firstName'
							render={({
								field: { onChange, value },
								fieldState: { error },
							}) => (
								<Input
									value={value}
									onChangeText={onChange}
									error={error?.message}
								/>
							)}
						/>
					</View>
					<View style={styles.field}>
						<AppText style={styles.label}>Фамилия</AppText>
						<Controller
							control={control}
							name='lastName'
							render={({
								field: { onChange, value },
								fieldState: { error },
							}) => (
								<Input
									value={value}
									onChangeText={onChange}
									error={error?.message}
								/>
							)}
						/>
					</View>
					<View style={styles.field}>
						<AppText style={styles.label}>Никнейм</AppText>
						<Controller
							control={control}
							name='nickname'
							render={({
								field: { onChange, value },
								fieldState: { error },
							}) => (
								<Input
									value={value}
									onChangeText={onChange}
									error={error?.message}
								/>
							)}
						/>
					</View>
					<View style={styles.field}>
						<AppText style={styles.label}>
							Электронная почта
						</AppText>
						<Controller
							control={control}
							name='email'
							render={({ field: { value } }) => (
								<Input
									value={value}
									editable={false}
									style={styles.emailInput}
								/>
							)}
						/>
					</View>
					<View style={styles.field}>
						<AppText style={styles.label}>Город</AppText>
						<Controller
							control={control}
							name='city'
							render={({
								field: { onChange, value },
								fieldState: { error },
							}) => (
								<Select
									options={cityOptions}
									value={value}
									onSelect={option => onChange(option.value)}
									placeholder={
										isLoadingCities || isRefetching
											? 'Загрузка...'
											: 'Выберите город'
									}
									error={error?.message}
								/>
							)}
						/>
					</View>
					<View style={styles.field}>
						<AppText style={styles.label}>Дата рождения</AppText>
						<Controller
							control={control}
							name='birthDate'
							render={({
								field: { onChange, value },
								fieldState: { error },
							}) => (
								<Input
									value={value}
									onChangeText={text =>
										onChange(formatBirthdate(text))
									}
									placeholder='ДД.ММ.ГГГГ'
									keyboardType='numeric'
									maxLength={10}
									error={error?.message}
								/>
							)}
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
				onSave={handleSubmit(handleSave)}
				isLoading={isSaving}
				onCancel={() => setVisible(false)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	buttonContent: {
		height: 44,
	},

	container: {
		flex: 1,
		paddingHorizontal: 16,
	},
	emailInput: {
		backgroundColor: Colors.noPhotoIconBackground,
	},
	field: {
		gap: Gaps.g8,
	},
	footer: {
		borderTopColor: Colors.gray,
		marginBottom: 40,
	},

	form: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		gap: Gaps.g20,
		marginTop: 32,
		paddingHorizontal: 16,
		paddingVertical: 24,
	},

	header: {
		paddingVertical: 16,
	},

	label: {
		color: Colors.darkGray,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f14,
		marginLeft: 16,
	},
	scrollContent: {
		paddingBottom: 20,
	},
});
