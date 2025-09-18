import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ticket, ticketApi, TicketCard, ticketsAtom } from '@/entities/ticket';
import { Colors, Fonts, Radius, Sizes } from '@/shared/tokens';
import { AppButton, AppText, BackButton } from '@/shared/ui';

import { EmptyTicketsPage } from './EmptyTicketsPage';

type Filter = 'all' | 'transport' | 'entertainment';

export const TicketsMainPage: React.FC = () => {
	const router = useRouter();
	const [tickets, setTickets] = useAtom(ticketsAtom);
	const [loading, setLoading] = useState(false);
	const [filter, setFilter] = useState<Filter>('all');

	useEffect(() => {
		if (!tickets.length) {
			setLoading(true);
			ticketApi
				.getMyTickets()
				.then(setTickets)
				.finally(() => setLoading(false));
		}
	}, [tickets.length, setTickets]);

	const filtered = useMemo(() => {
		if (filter === 'all') return tickets;
		return tickets.filter(t => t.businessCategory === filter);
	}, [filter, tickets]);

	const showEmpty = !loading && !tickets.length;

	return (
		<SafeAreaView style={styles.root}>
			<View style={styles.header}>
				<BackButton variant='icon' onPress={() => router.back()} />
				<AppText style={styles.headerTitle}>Мои билеты</AppText>
				<View style={styles.headerRightStub} />
			</View>

			{!showEmpty ? (
				<EmptyTicketsPage />
			) : (
				<ScrollView contentContainerStyle={styles.scrollContent}>
					<View style={styles.filtersRow}>
						<Pressable
							style={[
								styles.filterBtn,
								filter === 'entertainment' &&
									styles.filterBtnActive,
							]}
							onPress={() =>
								setFilter(
									filter === 'entertainment'
										? 'all'
										: 'entertainment',
								)
							}
						>
							<AppText
								style={
									filter === 'entertainment'
										? styles.filterTextActive
										: styles.filterText
								}
							>
								Развлечения
							</AppText>
						</Pressable>
						<Pressable
							style={[
								styles.filterBtn,
								filter === 'transport' &&
									styles.filterBtnActive,
							]}
							onPress={() =>
								setFilter(
									filter === 'transport'
										? 'all'
										: 'transport',
								)
							}
						>
							<AppText
								style={
									filter === 'transport'
										? styles.filterTextActive
										: styles.filterText
								}
							>
								Транспорт
							</AppText>
						</Pressable>
						<View style={styles.flexSpacer} />
						<View style={styles.addSmallBtn}>
							<AppButton
								text='Добавить билет'
								onPress={() => router.push('/tickets/add')}
								buttonBorderRadius={Radius.r16}
								textFontSize={Fonts.f16}
							/>
						</View>
					</View>
					<View style={styles.list}>
						{filtered.map(t => (
							<View key={t.id} style={styles.cardWrap}>
								<TicketCard ticket={t as Ticket} />
							</View>
						))}
					</View>
				</ScrollView>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	addSmallBtn: { flex: 1, height: 52 },
	cardWrap: { marginBottom: 8 },
	filterBtn: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r8,
		height: 32,
		justifyContent: 'center',
		paddingHorizontal: 16,
	},
	filterBtnActive: { backgroundColor: Colors.greenPrimary },
	filterText: {
		color: Colors.placeholderGray,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	filterTextActive: {
		color: Colors.white,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	filtersRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 12,
		marginBottom: 16,
	},
	flexSpacer: { flex: 1 },
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	headerRightStub: { height: Sizes.button.sm, width: Sizes.button.sm },
	headerTitle: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
	},
	list: { gap: 16 },
	root: { backgroundColor: Colors.grayBackground, flex: 1, padding: 16 },
	scrollContent: { paddingBottom: 40 },
});

export default TicketsMainPage;
