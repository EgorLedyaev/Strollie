import { EventType } from '@/entities/event';
import { Colors } from '@/shared/tokens';
import { AppText } from '@/shared/ui';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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
	container: {
		flexDirection: 'row',
		marginBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: Colors.gray,
	},
	filterTab: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		marginRight: 8,
	},
	activeFilterTab: {
		borderBottomWidth: 2,
		borderBottomColor: Colors.black,
	},
	filterText: {
		fontSize: 14,
		color: Colors.darkGray,
	},
	activeFilterText: {
		color: Colors.black,
		fontWeight: '600',
	},
});
