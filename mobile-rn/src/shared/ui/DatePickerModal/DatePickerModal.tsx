import ArrowLeftLargeIcon from '@/assets/icons/arrow/ArrowLeftLargeIcon';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppButton, AppText } from '@/shared/ui';

LocaleConfig.locales['ru'] = {
	monthNames: [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь',
	],
	monthNamesShort: [
		'Янв',
		'Фев',
		'Мар',
		'Апр',
		'Май',
		'Июн',
		'Июл',
		'Авг',
		'Сен',
		'Окт',
		'Ноя',
		'Дек',
	],
	dayNames: [
		'Воскресенье',
		'Понедельник',
		'Вторник',
		'Среда',
		'Четверг',
		'Пятница',
		'Суббота',
	],
	dayNamesShort: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
};
LocaleConfig.defaultLocale = 'ru';

interface DatePickerModalProps {
	visible: boolean;
	onClose: () => void;
	onSelectDate: (date: string | null) => void;
	initialDate?: string;
}

const formatDateHeader = (
	dateString: string,
): { main: string; year: string } => {
	const date = new Date(dateString);
	const year = date.getFullYear().toString();

	const weekday = new Intl.DateTimeFormat('ru-RU', {
		weekday: 'short',
	}).format(date);
	const month = new Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(
		date,
	);
	const day = date.getDate();

	const formattedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
	const formattedMonth = month.replace('.', '');

	const main = `${formattedWeekday}, ${day} ${formattedMonth}`;

	return { main, year };
};

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
	visible,
	onClose,
	onSelectDate,
	initialDate,
}) => {
	const [selectedDate, setSelectedDate] = useState(
		initialDate || new Date().toISOString().split('T')[0],
	);
	useEffect(() => {
		if (visible) {
			setSelectedDate(
				initialDate || new Date().toISOString().split('T')[0],
			);
		}
	}, [visible, initialDate]);

	const markedDates = useMemo(() => {
		return {
			[selectedDate]: {
				customStyles: {
					container: {
						borderWidth: 2,
						borderColor: Colors.successGreen,
						borderRadius: Radius.r20,
						backgroundColor: Colors.white,
					},
					text: {
						color: Colors.successGreen,
					},
				},
			},
		};
	}, [selectedDate]);

	const handleSelect = () => {
		onSelectDate(selectedDate);
		onClose();
	};

	const handleDelete = () => {
		onSelectDate(null);
		onClose();
	};

	const headerInfo = formatDateHeader(selectedDate);

	const renderArrow = (direction: 'left' | 'right') => {
		const rotation = direction === 'left' ? '0deg' : '-180deg';
		return (
			<ArrowLeftLargeIcon
				style={{
					transform: [{ rotate: rotation }],
				}}
			/>
		);
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType='fade'
			onRequestClose={onClose}
		>
			<Pressable style={styles.overlay} onPress={onClose}>
				<SafeAreaView style={styles.safeArea}>
					<Pressable style={styles.container}>
						<View style={styles.header}>
							<AppText style={styles.headerText}>
								{headerInfo.main}
							</AppText>
							<AppText style={styles.headerText}>
								{headerInfo.year}
							</AppText>
						</View>

						<View style={styles.calendar}>
							<Calendar
								current={selectedDate}
								onDayPress={day =>
									setSelectedDate(day.dateString)
								}
								markedDates={markedDates}
								theme={{
									backgroundColor: Colors.white,
									calendarBackground: Colors.white,
									monthTextColor: Colors.headerAndInputText,
									textMonthFontFamily: Fonts.medium,
									textMonthFontSize: Fonts.f20,
									textSectionTitleColor:
										Colors.lightInputText,
									textDayHeaderFontFamily: Fonts.regular,
									dayTextColor: Colors.headerAndInputText,
									textDayFontSize: Fonts.f14,
									textDayFontFamily: Fonts.semibold,
									todayTextColor: Colors.successGreen,
								}}
								firstDay={1}
								showSixWeeks
								renderArrow={renderArrow}
								markingType={'custom'}
								hideExtraDays={false}
								monthFormat={'MMMM'}
								// todayTitle={'Сегодня'}
							/>
						</View>

						<View style={styles.footer}>
							<AppButton
								text='Удалить'
								variant='secondary'
								buttonColor={Colors.white}
								textColor={Colors.red}
								textFontFamily={Fonts.regular}
								textFontSize={Fonts.f14}
								onPress={handleDelete}
							/>
							<AppButton
								text='Отмена'
								variant='secondary'
								buttonColor={Colors.white}
								textColor={Colors.lightInputText}
								textFontFamily={Fonts.regular}
								textFontSize={Fonts.f14}
								onPress={onClose}
							/>
							<AppButton
								text='Установить'
								variant='secondary'
								buttonColor={Colors.white}
								textColor={Colors.greenPrimary}
								textFontFamily={Fonts.regular}
								textFontSize={Fonts.f14}
								onPress={handleSelect}
							/>
						</View>
					</Pressable>
				</SafeAreaView>
			</Pressable>
		</Modal>
	);
};

const styles = StyleSheet.create({
	calendar: {
		height: 380,
		overflow: 'hidden',
		paddingHorizontal: 24,
		paddingVertical: 12,
	},
	container: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		overflow: 'hidden',
		width: 308,
	},
	footer: {
		alignItems: 'center',
		// gap: 20,
		flexDirection: 'row',
		height: 50,
		justifyContent: 'space-between',
		// paddingTop: 32,
		paddingBottom: 6,
		paddingHorizontal: 24,
	},
	header: {
		backgroundColor: Colors.successGreen,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 20,
	},

	headerText: {
		color: Colors.white,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
	},
	overlay: {
		alignItems: 'center',
		backgroundColor: Colors.modalOverlay,
		flex: 1,
		justifyContent: 'center',
	},
	safeArea: {
		alignItems: 'center',
		width: '100%',
	},
});
