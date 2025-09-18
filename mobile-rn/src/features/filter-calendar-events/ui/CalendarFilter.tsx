import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { EventType } from '@/entities/event';
import { Colors } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

import { useCalendarFilter } from '../model';

const filterOptions = [
	{ id: 'all', label: 'Все' },
	{ id: 'excursion', label: 'Экскурсии' },
	{ id: 'ticket', label: 'Билеты' },
	{ id: 'activity', label: 'Мероприятия' },
];

export const CalendarFilter: React.FC = () => {
	const { activeFilter, setFilter } = useCalendarFilter();

	return (
		<View style={styles.container}>
			{filterOptions.map(option => (
				<TouchableOpacity
					key={option.id}
					style={[
						styles.filterTab,
						activeFilter === option.id && styles.activeFilterTab,
					]}
					onPress={() => setFilter(option.id as EventType | 'all')}
				>
					<AppText
						style={[
							styles.filterText,
							activeFilter === option.id &&
								styles.activeFilterText,
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
		fontWeight: '600',
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
		fontSize: 14,
	},
});
