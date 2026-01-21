import AddTicketIcon from '@/assets/icons/tickets/AddTicketIcon';
import tickets_empty from '@/assets/images/tickets/tickets-empty.png';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TicketsErrorState, useTicketsQuery } from '@/entities/ticket';
import { Header } from '@/widgets/header';
import { bindLogger } from '@/shared/lib/logger';
import { Colors } from '@/shared/tokens';

import { MyCalendarWidget } from './MyCalendarWidget';

export const CalendarPage: React.FC = () => {
	const router = useRouter();
	const {
		data: tickets = [],
		isLoading,
		error,
		refetch: forceRefresh,
	} = useTicketsQuery();

	const log = useMemo(() => bindLogger('calendar'), []);
	React.useEffect(() => {
		log.info('mount');
	}, [log]);

	return (
		<SafeAreaView style={styles.root}>
			<Header title='Мой календарь' />

			{isLoading ? (
				<View style={styles.loadingWrap} testID='calendar-loading'>
					<ActivityIndicator
						size='large'
						color={Colors.greenPrimary}
					/>
				</View>
			) : error ? (
				<View style={styles.loadingWrap}>
					<TicketsErrorState onRetry={() => forceRefresh()} />
				</View>
			) : (
				<MyCalendarWidget
					tickets={tickets}
					onAddTicket={() => router.push('/tickets/add')}
				/>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	loadingWrap: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
	root: {
		backgroundColor: Colors.grayBackground,
		flex: 1,
		padding: 16,
	},
});
