import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTripCreate } from '@/pages/trip-create/model/useTripCreate';
import { ChecklistInput } from '@/pages/trip-create/ui/ChecklistInput';
import { ChecklistItem } from '@/pages/trip-create/ui/ChecklistItem';
import { SectionItem } from '@/pages/trip-create/ui/SectionItem';
import { Header } from '@/widgets/header';
import { NewTicketItem } from '@/entities/ticket';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppButton, AppText, AppTextInput, DatePickerModal } from '@/shared/ui';

export const TripCreatePage: React.FC = () => {
	const {
		startDate,
		endDate,
		selectedTickets,
		checklist,
		isAddingChecklistItem,
		isPickerVisible,
		editingDateType,
		canSave,
		openPicker,
		setPickerVisible,
		handleDateSelect,
		onSave,
		onDelete,
		setIsAddingChecklistItem,
		handleAddChecklistItem,
		handleDeleteChecklistItem,
		formatDateForDisplay,
	} = useTripCreate();

	return (
		<SafeAreaView style={styles.container}>
			<Header title='Новая поездка' />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.dateContainer}>
					<Pressable
						style={styles.dateBlock}
						onPress={() => openPicker('start')}
					>
						<AppText style={styles.dateLabel}>Начало</AppText>
						<AppText
							variant={'h2'}
							style={
								!startDate
									? styles.noDateValue
									: styles.dateValue
							}
						>
							{formatDateForDisplay(startDate)}
						</AppText>
					</Pressable>
					<Pressable
						style={styles.dateBlock}
						onPress={() => openPicker('end')}
					>
						<AppText style={styles.dateLabel}>Конец</AppText>
						<AppText
							variant={'h2'}
							style={
								!endDate ? styles.noDateValue : styles.dateValue
							}
						>
							{formatDateForDisplay(endDate)}
						</AppText>
					</Pressable>
				</View>

				<View style={styles.sectionsContainer}>
					<SectionItem
						label={'Билеты'}
						ref={'/trips/select-ticket'}
					/>
					<View style={styles.ticketsContainer}>
						{selectedTickets.map(ticket => (
							<NewTicketItem key={ticket.id} ticket={ticket} />
						))}
					</View>

					<SectionItem label={'Места'} ref={'/trips/add-place'} />
					<SectionItem
						label={'Чек-лист'}
						onPress={() => {
							setIsAddingChecklistItem(true);
						}}
					/>
					{checklist.length > 0 && (
						<View style={styles.checklistContainer}>
							{checklist.map(item => (
								<ChecklistItem
									key={item.id}
									item={item}
									onDelete={handleDeleteChecklistItem}
								/>
							))}
						</View>
					)}

					{isAddingChecklistItem && (
						<View style={styles.inputWrapper}>
							<ChecklistInput onAdd={handleAddChecklistItem} />
						</View>
					)}
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
					onPress={onDelete}
					style={styles.button}
					paddingHorizontal={24}
				/>
				<AppButton
					text='Сохранить поездку'
					onPress={onSave}
					disabled={!canSave}
					buttonBorderRadius={Radius.r16}
					style={[styles.button, styles.buttonAdd]}
					textFontSize={16}
					paddingHorizontal={24}
				/>
			</View>

			<DatePickerModal
				visible={isPickerVisible}
				onClose={() => setPickerVisible(false)}
				onSelectDate={handleDateSelect}
				initialDate={editingDateType === 'start' ? startDate : endDate}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	button: {
		fontFamily: Fonts.regular,
		height: 44,
		width: 'auto',
	},
	buttonAdd: {
		width: 235,
	},
	buttonsContainer: {
		flexDirection: 'row',
		gap: 16,
		justifyContent: 'center',
		paddingVertical: 16,
	},
	checklistContainer: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		gap: 8,
		padding: 16,
	},
	container: {
		backgroundColor: Colors.lightBackground,
		flex: 1,
		padding: 16,
	},
	dateBlock: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 8,
		justifyContent: 'center',
	},
	dateContainer: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 24,
		paddingHorizontal: 24,
		paddingVertical: 20,
	},
	dateLabel: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	dateValue: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
	},
	inputWrapper: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		marginTop: 8,
	},
	noDateValue: {
		color: Colors.lightInputText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	notesContainer: {
		marginTop: 20,
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
	sectionsContainer: {
		paddingTop: 30,
	},
	ticketsContainer: {
		gap: 16,
	},
});
