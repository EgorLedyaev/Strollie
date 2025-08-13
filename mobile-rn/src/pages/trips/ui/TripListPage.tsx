import PlusIcon from '@/assets/icons/action/PlusIcon';
import ArrowLeftMediumIcon from '@/assets/icons/arrow/ArrowLeftMediumIcon';
import emptyImg from '@/assets/images/unmatched.png';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	Image,
	StyleSheet,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tripsApi } from '@/pages/trips/api';
import { ticketApi } from '@/entities/ticket';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText, BackButton, IconButton } from '@/shared/ui';

interface TripVm {
	id: string;
	title: string; // исходное из API
	period: string; // 18.06.2025–24.06.2025
	ticketIds: string[];
	// отображаемое имя на основе билета
	displayTitle: string;
}

function pad2(n: number) {
	return n < 10 ? `0${n}` : `${n}`;
}
function formatDate(d: Date) {
	return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

export const TripListPage: React.FC = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [trips, setTrips] = useState<TripVm[]>([]);

	useEffect(() => {
		(async () => {
			setLoading(true);
			const [trps, tickets] = await Promise.all([
				tripsApi.getMyTrips(),
				ticketApi.getMyTickets(),
			]);
			const tMap: Record<string, { to: string }> = {};
			for (const tk of tickets) tMap[tk.id] = { to: tk.to };
			const tripsVm: TripVm[] = trps.map(t => {
				const firstTicket = t.ticketIds[0]
					? tMap[t.ticketIds[0]]
					: undefined;
				const displayTitle = firstTicket
					? `Поездка в ${firstTicket.to}`
					: t.name;
				return {
					id: t.id,
					title: t.name,
					displayTitle,
					period: `${formatDate(t.startDate)}–${formatDate(t.endDate)}`,
					ticketIds: t.ticketIds,
				};
			});
			setTrips(tripsVm);
			setLoading(false);
		})();
	}, []);

	const content = useMemo(() => {
		if (loading)
			return (
				<View style={styles.center}>
					<ActivityIndicator />
				</View>
			);
		if (trips.length === 0)
			return (
				<View style={styles.emptyBox}>
					<Image source={emptyImg} style={styles.emptyImage} />
					<AppText style={styles.emptyTitle}>Нет поездок</AppText>
					<AppText style={styles.emptyText}>
						Создайте первую поездку, чтобы видеть связанные билеты
					</AppText>
				</View>
			);
		return (
			<FlatList
				data={trips}
				keyExtractor={item => item.id}
				contentContainerStyle={styles.listContent}
				renderItem={({ item }) => {
					return (
						<View style={styles.tripCard}>
							<View style={styles.tripHeader}>
								<AppText style={styles.tripTitle}>
									{item.displayTitle}
								</AppText>
								<Link href={`/trips/${item.id}`} asChild>
									<IconButton
										feedback='opacity'
										opacity={0.6}
									>
										<AppText style={styles.linkText}>
											Подробнее
										</AppText>
									</IconButton>
								</Link>
							</View>
							<AppText style={styles.tripPeriod}>
								{item.period}
							</AppText>
						</View>
					);
				}}
			/>
		);
	}, [loading, trips]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.headerRow}>
					<BackButton onPress={() => router.back()} variant='icon' />
					<AppText style={styles.title}>Мои поездки</AppText>
					<Link href={'/trips/new'} asChild>
						<IconButton feedback='opacity' opacity={0.6}>
							<PlusIcon />
						</IconButton>
					</Link>
				</View>
				{content}
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
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	title: {
		fontSize: Fonts.f20,
		fontFamily: Fonts.bold,
		color: Colors.headerAndInputText,
	},
	listContent: { paddingBottom: 24, gap: 12 },
	tripCard: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		padding: 16,
	},
	tripHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	tripTitle: {
		fontSize: Fonts.f16,
		color: Colors.headerAndInputText,
		fontFamily: Fonts.semibold,
	},
	tripPeriod: {
		marginTop: 6,
		fontSize: Fonts.f14,
		color: Colors.textGray,
	},
	center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	emptyBox: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 32,
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
	},
	emptyImage: { width: 120, height: 120, marginBottom: 12 },
	emptyTitle: {
		fontSize: Fonts.f16,
		fontFamily: Fonts.semibold,
		color: Colors.headerAndInputText,
		marginBottom: 6,
	},
	emptyText: { fontSize: Fonts.f14, color: Colors.placeholderGray },
	linkText: { color: Colors.placeholderGray, fontSize: Fonts.f14 },
});
