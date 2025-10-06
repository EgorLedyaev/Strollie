import MoreArrowIcon from '@/assets/icons/MoreArrowIcon';
import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Ticket } from '@/entities/ticket';
import { Trip } from '@/entities/trip';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

// TODO: поменять внешний вид карточек и сделать чтоб они открывались
interface TripVm {
	id: string;
	title: string; // исходное из API
	period: string; // 18.06.2025–24.06.2025
	ticketIds: string[];
	displayTitle: string;
	endDate: Date;
}

interface TripListProps {
	trips: Trip[];
	tickets: Ticket[];
}

function pad2(n: number) {
	return n < 10 ? `0${n}` : `${n}`;
}
function formatDate(d: Date) {
	return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

const TripCard: React.FC<{ trip: TripVm; isCompleted?: boolean }> = ({
	trip,
	isCompleted = false,
}) => (
	<Link href={`/trips/${trip.id}`} asChild>
		<View style={styles.tripCard}>
			<View>
				<AppText
					style={[
						styles.tripTitle,
						isCompleted && styles.tripCompleted,
					]}
				>
					{trip.displayTitle}
				</AppText>
				<AppText
					style={[
						styles.tripPeriod,
						isCompleted && styles.tripCompleted,
					]}
				>
					{trip.period}
				</AppText>
			</View>
			<MoreArrowIcon />
		</View>
	</Link>
);

export const TripList: React.FC<TripListProps> = ({ trips, tickets }) => {
	const sections = useMemo(() => {
		const tMap: Record<string, { to: string }> = {};
		for (const tk of tickets) tMap[tk.id] = { to: tk.to };

		const tripsVm: TripVm[] = trips.map(t => {
			const firstTicket = t.ticketIds[0]
				? tMap[t.ticketIds[0]]
				: undefined;
			const displayTitle = firstTicket
				? `Поездка в ${firstTicket.to}`
				: t.title || 'Поездка';
			const startDate = new Date(t.startDate);
			const endDate = new Date(t.endDate);

			return {
				id: t.id,
				title: t.title || 'Поездка',
				displayTitle,
				period: `${formatDate(startDate)}–${formatDate(endDate)}`,
				ticketIds: t.ticketIds,
				endDate,
			};
		});

		const startOfToday = new Date();
		startOfToday.setHours(0, 0, 0, 0);

		const actual = tripsVm.filter(t => t.endDate >= startOfToday);
		const completed = tripsVm.filter(t => t.endDate < startOfToday);

		const byEndDateDesc = (a: TripVm, b: TripVm) =>
			b.endDate.getTime() - a.endDate.getTime();

		const result: Array<{ title: string; data: TripVm[] }> = [];
		if (actual.length > 0) {
			result.push({ title: 'Актуальные', data: actual });
		}
		if (completed.length > 0) {
			result.push({
				title: 'Завершенные',
				data: completed.sort(byEndDateDesc),
			});
		}
		return result;
	}, [trips, tickets]);

	return (
		<View style={styles.container}>
			{sections.map(section => (
				<View key={section.title} style={styles.section}>
					<AppText
						style={
							section.title === 'Актуальные'
								? [
										styles.sectionHeader,
										styles.sectionActualHeader,
									]
								: styles.sectionHeader
						}
					>
						{section.title}
					</AppText>
					<View style={styles.cardList}>
						{section.data.map(trip => (
							<TripCard
								key={trip.id}
								trip={trip}
								isCompleted={section.title === 'Завершенные'}
							/>
						))}
					</View>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	cardList: {
		gap: 12,
	},
	container: {
		backgroundColor: Colors.grayBackground,
		flex: 1,
	},

	section: {
		marginBottom: 24,
	},
	sectionActualHeader: {
		color: Colors.successGreen,
	},
	sectionHeader: {
		color: Colors.secondaryText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
		padding: 16,
	},
	tripCard: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		color: Colors.red,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 24,
	},
	tripCompleted: {
		color: Colors.secondaryText,
	},
	tripPeriod: {
		color: Colors.headerAndInputText,
		fontSize: Fonts.f14,
		marginTop: 6,
	},
	tripTitle: {
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
	},
});
