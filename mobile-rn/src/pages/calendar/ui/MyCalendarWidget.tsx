import FilterIcon from '@/assets/icons/FilterIcon';
import AddTicketIcon from '@/assets/icons/tickets/AddTicketIcon';
import tickets_empty from '@/assets/images/tickets/tickets-empty.png';
import tickets_empty_events from '@/assets/images/tickets/tickets-empty-events.png';
import { addDays, endOfDay, isAfter, parseISO, startOfDay, startOfWeek } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { NewTicketItem, type Ticket } from '@/entities/ticket';
import { formatDate } from '@/shared/lib/date';
import { EmptyState } from '@/widgets/empty-state';
import { Colors, Fonts, Gaps, Radius, Shadows } from '@/shared/tokens';
import { AppButton, AppText, DatePickerModal, Select, type SelectOption } from '@/shared/ui';

type BusinessFilter = 'transport' | 'entertainment';

export interface MyCalendarWidgetProps {
	tickets: Ticket[];
	onAddTicket: () => void;
}

const ALL_TICKETS_VALUE = '__all__';

const getTicketLabel = (ticket: Ticket): string => {
	if (ticket.title && ticket.title.trim().length > 0) return ticket.title;
	if (ticket.from && ticket.to) return `${ticket.from} — ${ticket.to}`;
	return 'Билет';
};

export const MyCalendarWidget: React.FC<MyCalendarWidgetProps> = ({
	tickets,
	onAddTicket,
}) => {
	const [businessFilter, setBusinessFilter] = useState<BusinessFilter>('transport');
	const [selectedTicketId, setSelectedTicketId] = useState<string>(ALL_TICKETS_VALUE);
	const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

	const selectedDateIso = useMemo(
		() => formatDate(selectedDate, 'yyyy-MM-dd'),
		[selectedDate],
	);

	const monthTitle = useMemo(() => {
		const title = formatDate(selectedDate, 'LLLL yyyy');
		return title ? title.charAt(0).toUpperCase() + title.slice(1) : '';
	}, [selectedDate]);

	const selectedDateTitle = useMemo(() => {
		const title = formatDate(selectedDate, 'EEEE, d MMMM');
		return title ? title.charAt(0).toUpperCase() + title.slice(1) : '';
	}, [selectedDate]);

	const weekStart = useMemo(
		() => startOfWeek(selectedDate, { weekStartsOn: 1 }),
		[selectedDate],
	);

	const weekDays = useMemo(() => {
		return Array.from({ length: 7 }, (_, idx) => addDays(weekStart, idx));
	}, [weekStart]);

	const ticketOptions: SelectOption[] = useMemo(() => {
		const opts: SelectOption[] = [
			{ label: 'Все билеты', value: ALL_TICKETS_VALUE },
			...tickets.map(t => ({ label: getTicketLabel(t), value: t.id })),
		];
		return opts;
	}, [tickets]);

	const filteredTickets = useMemo(() => {
		let result = tickets;
		if (selectedTicketId !== ALL_TICKETS_VALUE) {
			result = result.filter(t => t.id === selectedTicketId);
		}
		result = result.filter(t => t.businessCategory === businessFilter);
		return result;
	}, [businessFilter, selectedTicketId, tickets]);

	const hasTicketsByDay = useMemo(() => {
		const byDayKey = new Set<string>();
		for (const t of filteredTickets) {
			const d = parseISO(t.departureTime);
			byDayKey.add(formatDate(d, 'yyyy-MM-dd'));
		}
		return (date: Date) => byDayKey.has(formatDate(date, 'yyyy-MM-dd'));
	}, [filteredTickets]);

	const dayTickets = useMemo(() => {
		const start = startOfDay(selectedDate);
		const end = endOfDay(selectedDate);
		return filteredTickets.filter(t => {
			const d = parseISO(t.departureTime);
			return d >= start && d <= end;
		});
	}, [filteredTickets, selectedDate]);

	const nextTickets = useMemo(() => {
		const end = endOfDay(selectedDate);
		return filteredTickets
			.filter(t => isAfter(parseISO(t.departureTime), end))
			.sort(
				(a, b) =>
					parseISO(a.departureTime).getTime() -
					parseISO(b.departureTime).getTime(),
			);
	}, [filteredTickets, selectedDate]);

	const hasAnyTickets = tickets.length > 0;
	const hasAnyFilteredTickets = filteredTickets.length > 0;

	const emptyStateImage = businessFilter === 'transport' ? tickets_empty : tickets_empty_events;
	const emptyStateDescription =
		businessFilter === 'transport'
			? 'Здесь можно хранить свои билеты на различные рейсы'
			: 'Здесь можно хранить свои билеты на различные мероприятия';

	const emptyImageNode = (
		<View>
			<Image
				source={emptyStateImage}
				style={[styles.emptyImage, styles.emptyImageRotated]}
			/>
			<Image source={emptyStateImage} style={styles.emptyImage} />
		</View>
	);

	const emptyActionNode = (
		<AppButton
			onPress={onAddTicket}
			buttonBorderRadius={Radius.r16}
			textFontSize={Fonts.f16}
			textFontFamily={Fonts.medium}
			style={styles.emptyAddButton}
		>
			<View style={styles.emptyAddButtonContent}>
				<AddTicketIcon />
				<AppText variant='button' style={styles.emptyAddButtonText}>
					Добавить билет
				</AppText>
			</View>
		</AppButton>
	);

	return (
		<View style={styles.root}>
			<Pressable
				style={styles.dateHeader}
				onPress={() => setIsDatePickerOpen(true)}
				accessibilityRole='button'
			>
				<View style={styles.dateHeaderDot} />
				<View style={styles.dateHeaderTextCol}>
					<AppText style={styles.monthTitle}>{monthTitle}</AppText>
					<AppText style={styles.dateTitle}>{selectedDateTitle}</AppText>
				</View>
			</Pressable>

			<View style={styles.weekRow}>
				{weekDays.map(date => {
					const isSelected = formatDate(date, 'yyyy-MM-dd') === selectedDateIso;
					const isToday = formatDate(date, 'yyyy-MM-dd') === formatDate(new Date(), 'yyyy-MM-dd');
					const hasDot = hasTicketsByDay(date);

					return (
						<Pressable
							key={formatDate(date, 'yyyy-MM-dd')}
							onPress={() => setSelectedDate(date)}
							style={[styles.dayChip, isSelected && styles.dayChipSelected]}
							accessibilityRole='button'
						>
							<AppText
								style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}
							>
								{formatDate(date, 'd')}
							</AppText>
							<AppText
								style={[styles.dayWeekday, isSelected && styles.dayWeekdaySelected]}
							>
								{formatDate(date, 'EE')}
							</AppText>
							{isToday ? <AppText style={styles.todayLabel}>сегодня</AppText> : null}
							{hasDot ? <View style={styles.dot} /> : <View style={styles.dotStub} />}
						</Pressable>
					);
				})}
			</View>

			<View style={styles.filtersRow}>
				<Pressable style={styles.filterIconBtn}>
					<FilterIcon />
				</Pressable>

				<View style={styles.ticketSelectWrap}>
					<Select
						options={ticketOptions}
						value={selectedTicketId}
						onSelect={opt => setSelectedTicketId(opt.value)}
						placeholder='Все билеты'
					/>
				</View>

				<Pressable
					style={[
						styles.filterBtn,
						businessFilter === 'transport' && styles.filterBtnActive,
					]}
					onPress={() => setBusinessFilter('transport')}
					accessibilityRole='button'
				>
					<AppText
						style={[styles.filterText, businessFilter === 'transport' && styles.filterTextActive]}
					>
						Транспорт
					</AppText>
				</Pressable>

				<Pressable
					style={[
						styles.filterBtn,
						businessFilter === 'entertainment' && styles.filterBtnActive,
					]}
					onPress={() => setBusinessFilter('entertainment')}
					accessibilityRole='button'
				>
					<AppText
						style={[styles.filterText, businessFilter === 'entertainment' && styles.filterTextActive]}
					>
						Мероприятия
					</AppText>
				</Pressable>
			</View>

			{hasAnyTickets && hasAnyFilteredTickets ? (
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.section}>
						<AppText style={[styles.sectionHeader, styles.todayHeader]}>Сегодня</AppText>
						{dayTickets.length === 0 ? (
							<AppText style={styles.emptyInline}>На сегодня билетов нет</AppText>
						) : (
							dayTickets.map(t => (
								<View key={t.id} style={styles.cardWrap}>
									<NewTicketItem ticket={t} />
								</View>
							))
						)}
					</View>

					<View style={styles.section}>
						<AppText style={[styles.sectionHeader, styles.futureHeader]}>
							В последущие дни
						</AppText>
						{nextTickets.length === 0 ? (
							<AppText style={styles.emptyInline}>
								В последущие дни билетов нет
							</AppText>
						) : (
							nextTickets.map(t => (
								<View key={t.id} style={styles.cardWrap}>
									<NewTicketItem ticket={t} />
								</View>
							))
						)}
					</View>
				</ScrollView>
			) : (
				<View style={styles.emptyContainer}>
					<EmptyState
						title='Билетов пока нет'
						description={emptyStateDescription}
						image={emptyImageNode}
						action={emptyActionNode}
						testId='calendar-empty'
					/>
				</View>
			)}

			<DatePickerModal
				visible={isDatePickerOpen}
				onClose={() => setIsDatePickerOpen(false)}
				initialDate={selectedDateIso}
				onSelectDate={dateString => {
					if (!dateString) return;
					setSelectedDate(parseISO(dateString));
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	cardWrap: { marginBottom: 8 },
	dateHeader: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 8,
		marginBottom: 8,
		paddingHorizontal: 4,
	},
	dateHeaderDot: {
		backgroundColor: Colors.successGreen,
		borderRadius: Radius.r100,
		height: 10,
		width: 10,
	},
	dateHeaderTextCol: {
		flex: 1,
	},
	dateTitle: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f12,
		marginTop: 2,
	},
	dayChip: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r12,
		paddingHorizontal: 10,
		paddingVertical: 8,
		width: 56,
	},
	dayChipSelected: {
		backgroundColor: Colors.greenPrimary,
	},
	dayNumber: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
	},
	dayNumberSelected: {
		color: Colors.white,
	},
	dayWeekday: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f12,
		marginTop: 2,
	},
	dayWeekdaySelected: {
		color: Colors.white,
	},
	dot: {
		backgroundColor: Colors.greenPrimary,
		borderRadius: Radius.r100,
		height: 6,
		marginTop: 6,
		width: 6,
	},
	dotStub: {
		height: 6,
		marginTop: 6,
		width: 6,
	},
	emptyAddButton: { height: 52, width: '100%' },
	emptyAddButtonContent: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: Gaps.g8,
	},
	emptyAddButtonText: {
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'flex-start',
		paddingHorizontal: 16,
		paddingTop: 80,
	},
	emptyImage: {
		alignSelf: 'center',
		height: 265,
		justifyContent: 'center',
		marginBottom: Gaps.g20,
		resizeMode: 'contain',
		width: 265,
	},
	emptyImageRotated: { position: 'absolute', transform: [{ rotate: '-15deg' }] },
	emptyInline: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		marginLeft: 4,
	},
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
		gap: 12,
		marginBottom: 16,
		marginLeft: 12,
		marginTop: 16,
	},
	futureHeader: {
		color: Colors.secondaryText,
	},
	monthTitle: {
		color: Colors.black,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
	},
	root: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 120,
		paddingHorizontal: 20,
	},
	section: {
		gap: 16,
		marginBottom: 24,
	},
	sectionHeader: {
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
	},
	ticketSelectWrap: {
		flex: 1,
	},
	todayHeader: {
		color: Colors.successGreen,
	},
	todayLabel: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f10,
		marginTop: 2,
	},
	weekRow: {
		flexDirection: 'row',
		gap: 8,
		justifyContent: 'space-between',
		paddingHorizontal: 4,
		paddingTop: 8,
	},
});