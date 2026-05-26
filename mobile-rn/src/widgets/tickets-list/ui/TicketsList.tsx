import FilterIcon from '@/assets/icons/FilterIcon';
import {
	compareAsc,
	compareDesc,
	endOfToday,
	isAfter,
	isBefore,
	isWithinInterval,
	parseISO,
	startOfToday,
} from 'date-fns';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { NewTicketItem, Ticket } from '@/entities/ticket';
import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

type Filter = 'all' | 'transport' | 'entertainment';

type TicketsListProps = {
	tickets: Ticket[];
	onTicketPress?: (ticketId: string) => void; // Прокидываем обработчaик нажатия
	selectedTicketIds?: string[]; // ID выбранного билета
};

export const TicketsList: React.FC<TicketsListProps> = ({
	tickets,
	onTicketPress,
	selectedTicketIds = [],
}) => {
	const [filter, setFilter] = useState<Filter>('all');

	const sections = useMemo(() => {
		const filteredTickets: Ticket[] =
			filter === 'all'
				? tickets
				: tickets.filter((t: Ticket) => t.businessCategory === filter);

		const start = startOfToday();
		const end = endOfToday();

		const today = filteredTickets.filter((t: Ticket) => {
			const d = parseISO(t.departureTime);
			return isWithinInterval(d, {
				start: start,
				end: end,
			});
		});
		const future = filteredTickets.filter((t: Ticket) =>
			isAfter(parseISO(t.departureTime), end),
		);
		// Прошедшие билеты (до начала сегодняшнего дня) — сейчас не показывались,
		// из-за чего пользователь мог подумать, что билет "пропал", если выбрал дату в прошлом.
		const past = filteredTickets.filter((t: Ticket) =>
			isBefore(parseISO(t.departureTime), start),
		);

		const byAsc = (a: Ticket, b: Ticket) =>
			compareAsc(parseISO(a.departureTime), parseISO(b.departureTime));
		const byDesc = (a: Ticket, b: Ticket) =>
			compareDesc(parseISO(a.departureTime), parseISO(b.departureTime));

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
		if (past.length > 0) {
			result.push({ title: 'Прошедшие', data: past.sort(byDesc) });
		}
		return result;
	}, [filter, tickets]);

	return (
		<ScrollView
			contentContainerStyle={styles.scrollContent}
			showsVerticalScrollIndicator={false}
		>
			<View style={styles.filtersRow}>
				<Pressable style={styles.filterIconBtn}>
					<FilterIcon />
				</Pressable>
				<Pressable
					style={[
						styles.filterBtn,
						filter === 'transport' && styles.filterBtnActive,
					]}
					onPress={() =>
						setFilter(filter === 'transport' ? 'all' : 'transport')
					}
				>
					<AppText
						style={[
							styles.filterText,
							filter === 'transport' && styles.filterTextActive,
						]}
					>
						Транспорт
					</AppText>
				</Pressable>
				<Pressable
					style={[
						styles.filterBtn,
						filter === 'entertainment' && styles.filterBtnActive,
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
			<View style={styles.list} testID='tickets-list'>
				{sections.map(section => (
					<View key={section.title} style={styles.section}>
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
							<View key={t.id} style={styles.cardWrap}>
								<NewTicketItem
									ticket={t as Ticket}
									onPress={onTicketPress}
									isSelected={selectedTicketIds.includes(
										t.id,
									)}
									// isSelected={t.id === selectedTicketId}
								/>
							</View>
						))}
					</View>
				))}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	cardWrap: { marginBottom: 8 },
	filterBtn: {
		backgroundColor: Colors.white,
		borderColor: Colors.transparent,
		borderRadius: Radius.r8,
		borderWidth: 1,
		height: 32,
		justifyContent: 'center',
		paddingHorizontal: 16,
	},
	filterBtnActive: {
		borderColor: Colors.greenPrimary,
		borderWidth: 1,
		boxShadow: Shadows.filterButtonShadow,
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
	},
	list: {
		gap: 16,
		paddingHorizontal: 20,
		// paddingTop: 24,
	},
	scrollContent: {
		paddingBottom: 120,
	},

	section: {
		gap: 16,
	},
	sectionHeader: {
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
	},
	todayHeader: {
		color: Colors.greenPrimary,
	},
});

export default TicketsList;
