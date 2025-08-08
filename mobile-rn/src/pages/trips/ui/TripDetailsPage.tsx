import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tripsApi } from '@/pages/trips/api';
import { Ticket, ticketApi, TicketCard } from '@/entities/ticket';
import { Colors, Fonts } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

function pad2(n: number) {
	return n < 10 ? `0${n}` : `${n}`;
}
function formatDate(d: Date) {
	return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

export const TripDetailsPage: React.FC = () => {
	const { id } = useLocalSearchParams();
	const [loading, setLoading] = useState(true);
	const [title, setTitle] = useState('');
	const [period, setPeriod] = useState('');
	const [tickets, setTickets] = useState<Ticket[]>([]);

	useEffect(() => {
		(async () => {
			if (!id || Array.isArray(id)) return;
			setLoading(true);
			const [trips, allTickets] = await Promise.all([
				tripsApi.getMyTrips(),
				ticketApi.getMyTickets(),
			]);
			const trip = trips.find(t => t.id === id);
			if (trip) {
				setTitle(trip.name);
				setPeriod(
					`${formatDate(trip.startDate)}–${formatDate(trip.endDate)}`,
				);
				setTickets(
					allTickets.filter(tk => trip.ticketIds.includes(tk.id)),
				);
			}
			setLoading(false);
		})();
	}, [id]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<AppText style={styles.title}>Детали поездки</AppText>
				{loading ? (
					<View style={styles.center}>
						<ActivityIndicator />
					</View>
				) : (
					<>
						<AppText style={styles.tripTitle}>{title}</AppText>
						<AppText style={styles.tripPeriod}>{period}</AppText>
						<FlatList
							contentContainerStyle={styles.detailsList}
							data={tickets}
							keyExtractor={item => item.id}
							renderItem={({ item }) => (
								<View style={styles.ticketItem}>
									<TicketCard ticket={item} />
								</View>
							)}
						/>
					</>
				)}
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightBackground,
		padding: 16,
	},
	content: {
		flex: 1,
	},
	title: {
		fontSize: Fonts.f20,
		fontFamily: Fonts.bold,
		marginBottom: 16,
		color: Colors.headerAndInputText,
	},
	tripTitle: {
		fontSize: Fonts.f16,
		fontFamily: Fonts.semibold,
		color: Colors.headerAndInputText,
	},
	tripPeriod: { fontSize: Fonts.f14, color: Colors.textGray, marginTop: 4 },
	center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	detailsList: { paddingTop: 16 },
	ticketItem: { marginBottom: 12 },
});
