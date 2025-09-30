import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/widgets/header';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppButton, AppText, AppTextInput } from '@/shared/ui';

export const TripCreatePage: React.FC = () => {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.container}>
			<Header title='Новая поездка' />
			<ScrollView showsVerticalScrollIndicator={false}>
				<Pressable style={styles.card}>
					<View style={styles.dateBlock}>
						<AppText style={styles.dateLabel}>Начало</AppText>
						<AppText variant={'h2'} style={styles.dateValue}>
							18.02.2025
						</AppText>
					</View>
					<View style={styles.dateBlock}>
						<AppText style={styles.dateLabel}>Конец</AppText>
						<AppText variant={'h2'} style={styles.dateValue}>
							18.02.2025
						</AppText>
					</View>
				</Pressable>

				<View style={styles.sectionsCard}>
					<AppText variant={'header'} style={styles.sectionItemTitle}>
						Билеты
					</AppText>
					<AppText variant={'header'} style={styles.sectionItemTitle}>
						Заметки
					</AppText>
					<AppText variant={'header'} style={styles.sectionItemTitle}>
						Места
					</AppText>
					<AppText variant={'header'} style={styles.sectionItemTitle}>
						Чек-лист
					</AppText>
				</View>

				<View style={styles.notesContainer}>
					<AppText variant={'header'} style={styles.sectionItemTitle}>
						Заметки
					</AppText>
					<AppTextInput
						style={styles.notesInput}
						multiline
						placeholder='Введите текст того, что вы хотели записать или дополнить'
						placeholderTextColor={Colors.grayMedium}
					/>
				</View>
			</ScrollView>
			<View style={styles.buttonsContainer}>
				<AppButton
					text='Удалить'
					variant='secondary'
					buttonBorderRadius={Radius.r16}
					buttonColor={Colors.white}
					textColor={Colors.red}
					textFontSize={16}
					textFontFamily={Fonts.regular}
					onPress={() => router.back()}
					style={styles.button}
					paddingHorizontal={24}
				/>
				<AppButton
					text='Сохранить поездку'
					onPress={() => router.back()}
					buttonBorderRadius={Radius.r16}
					style={styles.button}
					textFontSize={16}
					paddingHorizontal={24}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	button: {
		fontFamily: Fonts.regular,
		height: 44,
		width: 'auto',
	},
	buttonsContainer: {
		flexDirection: 'row',
		gap: 16,
	},
	// Общий стиль для белых карточек
	card: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	container: {
		backgroundColor: Colors.lightBackground,
		flex: 1,
		padding: 16,
	},

	dateBlock: {
		alignItems: 'flex-start',
		flexDirection: 'row',
	},
	dateLabel: {
		color: Colors.gray,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	dateValue: {
		fontSize: Fonts.f16,
		marginTop: 4,
	},
	notesContainer: {
		marginTop: 30,
	},
	notesInput: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		color: Colors.black,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
		height: 120,
		marginTop: 12,
		padding: 16,
		textAlignVertical: 'top',
	},
	sectionItemTitle: {
		fontSize: Fonts.f16,
	},
	sectionsCard: {
		gap: 37,
		paddingTop: 30,
	},
});
