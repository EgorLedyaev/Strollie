import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors } from '../../tokens';
import { AppText } from '../Text';

export interface CalendarDay {
	date: Date;
	isActive?: boolean;
	hasEvents?: boolean;
	isCurrentMonth?: boolean;
}

interface CalendarGridProps {
	days: CalendarDay[];
	onPressDay: (day: CalendarDay) => void;
	style?: object;
}

export const CalendarGrid = ({
	days,
	onPressDay,
	style,
}: CalendarGridProps) => {
	const renderDay = (day: CalendarDay, index: number) => {
		const dayNumber = day.date.getDate();

		return (
			<TouchableOpacity
				key={`day-${index}`}
				style={[
					styles.dayContainer,
					!day.isCurrentMonth && styles.notCurrentMonth,
					day.isActive && styles.activeDay,
				]}
				onPress={() => onPressDay(day)}
			>
				<AppText
					style={[
						styles.dayText,
						!day.isCurrentMonth && styles.notCurrentMonthText,
						day.isActive && styles.activeDayText,
					]}
				>
					{dayNumber}
				</AppText>
				{day.hasEvents && <View style={styles.eventDot} />}
			</TouchableOpacity>
		);
	};

	return (
		<View style={[styles.container, style]}>
			<View style={styles.weekHeader}>
				{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(
					(day, index) => (
						<View
							key={`header-${index}`}
							style={styles.weekHeaderItem}
						>
							<AppText style={styles.weekHeaderText}>
								{day}
							</AppText>
						</View>
					),
				)}
			</View>
			<View style={styles.daysGrid}>
				{days.map((day, index) => renderDay(day, index))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
	},
	weekHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	weekHeaderItem: {
		flex: 1,
		alignItems: 'center',
		padding: 4,
	},
	weekHeaderText: {
		fontSize: 12,
		color: Colors.lightGray,
	},
	daysGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	dayContainer: {
		width: '14.28%', // 7 дней в неделю
		aspectRatio: 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
	},
	dayText: {
		fontSize: 16,
		color: Colors.black,
	},
	notCurrentMonth: {
		opacity: 0.4,
	},
	notCurrentMonthText: {
		color: Colors.darkGray,
	},
	activeDay: {
		backgroundColor: Colors.black,
		borderRadius: 100,
	},
	activeDayText: {
		color: Colors.white,
	},
	eventDot: {
		position: 'absolute',
		bottom: '15%',
		width: 4,
		height: 4,
		borderRadius: 2,
		backgroundColor: Colors.black,
	},
});
