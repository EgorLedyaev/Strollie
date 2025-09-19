import FilterIcon from '@/assets/icons/FilterIcon';
import AddTicketIcon from '@/assets/icons/tickets/AddTicketIcon';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useEffect, useMemo, useState } from 'react';
import {
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ticket, ticketApi, TicketCard, ticketsAtom } from '@/entities/ticket';
import { Colors, Fonts, Gaps, Radius, Sizes } from '@/shared/tokens';
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

	const sections = useMemo(() => {
		const filteredTickets =
			filter === 'all'
				? tickets
				: tickets.filter(t => t.businessCategory === filter);

		const startOfToday = new Date();
		startOfToday.setHours(0, 0, 0, 0);
		const endOfToday = new Date();
		endOfToday.setHours(23, 59, 59, 999);

		const today = filteredTickets.filter(t => {
			const d = new Date(t.departureTime);
			return d >= startOfToday && d <= endOfToday;
		});
		const future = filteredTickets.filter(
			t => new Date(t.departureTime) > endOfToday,
		);

		const byAsc = (a: Ticket, b: Ticket) =>
			+new Date(a.departureTime) - +new Date(b.departureTime);

		const result: Array<{ title: string; data: Ticket[] }> = [];
		if (today.length > 0) {
			result.push({ title: 'Сегодня', data: today.sort(byAsc) });
		}
		if (future.length > 0) {
			result.push({
				title: 'В последующие дни',
				data: future.sort(byAsc),
			});
		}
		return result;
	}, [filter, tickets]);

	const showEmpty = !loading && !tickets.length;

	return (
		<SafeAreaView style={styles.root}>
			<View style={styles.header}>
				<BackButton variant='icon' onPress={() => router.back()} />
				<AppText style={styles.headerTitle}>Мои билеты</AppText>
				<View style={styles.headerRightStub} />
			</View>

			{showEmpty ? (
				<EmptyTicketsPage />
			) : (
				<>
					<ScrollView contentContainerStyle={styles.scrollContent}>
						<View style={styles.filtersRow}>
							<Pressable style={styles.filterIconBtn}>
								<FilterIcon />
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
									style={[
										styles.filterText,
										filter === 'transport' &&
											styles.filterTextActive,
									]}
								>
									Транспорт
								</AppText>
							</Pressable>
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
									style={[
										styles.filterText,
										filter === 'entertainment' &&
											styles.filterTextActive,
									]}
								>
									Развлечения
								</AppText>
							</Pressable>
						</View>
						<View style={styles.list}>
							{sections.map(section => (
								<View
									key={section.title}
									style={styles.section}
								>
									<AppText
										style={[
											styles.sectionHeader,
											section.title === 'Сегодня'
												? styles.todayHeader
												: styles.futureHeader,
										]}
									>
										{section.title}
									</AppText>

									{section.data.map(t => (
										<View
											key={t.id}
											style={styles.cardWrap}
										>
											<TicketCard ticket={t as Ticket} />
										</View>
									))}
								</View>
							))}
						</View>
					</ScrollView>

					<View style={styles.fabContainer}>
						<AppButton
							onPress={() => router.push('/tickets/add')}
							buttonBorderRadius={Radius.r16}
							style={styles.addButton}
						>
							<View style={styles.addButtonContent}>
								<AddTicketIcon />
								<AppText
									variant='button'
									style={styles.addButtonText}
								>
									Добавить билет
								</AppText>
							</View>
						</AppButton>
					</View>
				</>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	addButton: {
		height: 52,
		width: 215,
		...Platform.select({
			ios: {
				shadowColor: 'rgba(169, 169, 169, 0.25)',
				shadowOffset: { width: 2, height: 4 },
				shadowOpacity: 1,
				shadowRadius: 6,
			},
			android: {
				elevation: 8,
			},
		}),
	},
	addButtonContent: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: Gaps.g8,
	},
	addButtonText: {
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
	},
	cardWrap: {},
	fabContainer: {
		alignItems: 'center',
		bottom: 30,
		height: 56,
		position: 'absolute',
		right: 16,
	},
	filterBtn: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r8,
		height: 32,
		justifyContent: 'center',
		paddingHorizontal: 16,
	},
	filterBtnActive: {
		borderColor: Colors.greenPrimary,
		borderWidth: 1,
		...Platform.select({
			ios: {
				shadowColor: Colors.successGreen,
				shadowOffset: { width: 2, height: 4 },
				shadowOpacity: 1,
				shadowRadius: 6,
			},
			android: {
				elevation: 5,
			},
		}),
	},
	filterIconBtn: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r8,
		height: 32,
		justifyContent: 'center',
		width: 32,
	},
	filterText: {
		color: Colors.lightInputText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	filterTextActive: {
		color: Colors.successGreen,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	filtersRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 16,
		marginBottom: 16,
		marginLeft: 12,
		marginTop: 32,
	},
	futureHeader: {
		color: Colors.secondaryText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	headerRightStub: {
		height: Sizes.button.sm,
		width: Sizes.button.sm,
	},
	headerTitle: {
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
	},
	list: {
		gap: 16,
		paddingHorizontal: 20,
		// paddingTop: 24,
	},
	root: {
		backgroundColor: Colors.grayBackground,
		flex: 1,
		padding: 16,
	},
	scrollContent: {
		paddingBottom: 120,
	},
	section: {
		gap: 16,
	},
	sectionHeader: {
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f18,
	},
	todayHeader: {
		color: Colors.greenPrimary,
	},
});

export default TicketsMainPage;
