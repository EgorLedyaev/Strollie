import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

import { CalendarFilter, CalendarFilterValue } from './CalendarFilter';

type CalendarEvent = {
	id: string;
	title: string;
	type: Exclude<CalendarFilterValue, 'all'>;
	time: string;
};

const mockEvents: CalendarEvent[] = [
	{
		id: '1',
		title: 'Экскурсия по центру города',
		type: 'excursion',
		time: '10:00',
	},
	{
		id: '2',
		title: 'Поход в театр',
		type: 'ticket',
		time: '19:00',
	},
	{
		id: '3',
		title: 'Йога в парке',
		type: 'activity',
		time: '08:30',
	},
];

export const CalendarPage: React.FC = () => {
	const [filter, setFilter] = useState<CalendarFilterValue>('all');

	const filteredEvents = useMemo(() => {
		if (filter === 'all') {
			return mockEvents;
		}

		return mockEvents.filter(event => event.type === filter);
	}, [filter]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<AppText style={styles.title}>Календарь</AppText>
				<CalendarFilter value={filter} onChange={setFilter} />
				<View style={styles.list}>
					{filteredEvents.length ? (
						filteredEvents.map(event => (
							<View key={event.id} style={styles.eventRow}>
								<AppText style={styles.eventTitle}>
									{event.title}
								</AppText>
								<AppText style={styles.eventTime}>
									{event.time}
								</AppText>
							</View>
						))
					) : (
						<AppText style={styles.emptyText}>
							Для выбранного типа пока нет событий
						</AppText>
					)}
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.lightBackground,
		flex: 1,
		padding: 16,
	},
	content: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r20,
		flex: 1,
		padding: 16,
	},
	emptyText: {
		color: Colors.secondaryText,
	},
	eventRow: {
		borderBottomColor: Colors.gray,
		borderBottomWidth: StyleSheet.hairlineWidth,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 12,
	},
	eventTime: {
		color: Colors.secondaryText,
	},
	eventTitle: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.medium,
	},
	list: {
		flex: 1,
	},
	title: {
		color: Colors.black,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
		marginBottom: 16,
	},
});
