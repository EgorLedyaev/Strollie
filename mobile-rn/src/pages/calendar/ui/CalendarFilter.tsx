import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors, Fonts } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

export type CalendarFilterValue = 'all' | 'excursion' | 'ticket' | 'activity';

interface CalendarFilterProps {
	value: CalendarFilterValue;
	onChange: (value: CalendarFilterValue) => void;
}

const filterOptions: Array<{ id: CalendarFilterValue; label: string }> = [
	{ id: 'all', label: 'Все' },
	{ id: 'excursion', label: 'Экскурсии' },
	{ id: 'ticket', label: 'Билеты' },
	{ id: 'activity', label: 'Мероприятия' },
];

export const CalendarFilter: React.FC<CalendarFilterProps> = ({
	value,
	onChange,
}) => {
	return (
		<View style={styles.container}>
			{filterOptions.map(option => (
				<TouchableOpacity
					key={option.id}
					style={[
						styles.filterTab,
						value === option.id && styles.activeFilterTab,
					]}
					onPress={() => onChange(option.id)}
				>
					<AppText
						style={[
							styles.filterText,
							value === option.id && styles.activeFilterText,
						]}
					>
						{option.label}
					</AppText>
				</TouchableOpacity>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	activeFilterTab: {
		borderBottomColor: Colors.black,
		borderBottomWidth: 2,
	},
	activeFilterText: {
		color: Colors.black,
		fontFamily: Fonts.semibold,
	},
	container: {
		borderBottomColor: Colors.gray,
		borderBottomWidth: 1,
		flexDirection: 'row',
		marginBottom: 16,
	},
	filterTab: {
		marginRight: 8,
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
	filterText: {
		color: Colors.darkGray,
		fontSize: Fonts.f14,
	},
});
