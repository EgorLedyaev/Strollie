import FilterIcon from '@/assets/icons/FilterIcon';
import AddTicketIcon from '@/assets/icons/tickets/AddTicketIcon';
import tickets_empty from '@/assets/images/tickets/tickets-empty.png';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/widgets/empty-state';
import { Header } from '@/widgets/header';
import {
	NewTicketItem,
	Ticket,
	ticketApi,
	ticketsAtom,
} from '@/entities/ticket';
import { bindLogger } from '@/shared/lib/logger';
import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppButton, AppText } from '@/shared/ui';

type Filter = 'all' | 'transport' | 'entertainment';
type FetchState = 'loading' | 'loaded' | 'error';

export const TicketsMainPage: React.FC = () => {
	const router = useRouter();
	const [tickets, setTickets] = useAtom(ticketsAtom);
	// Управляем этапами загрузки чтобы избежать мерцания
	const [fetchState, setFetchState] = useState<FetchState>(
		tickets.length ? 'loaded' : 'loading',
	);
	const [filter, setFilter] = useState<Filter>('all');

	// Feature scoped logger
	const log = useMemo(() => bindLogger('tickets'), []);

	// Mount log (один раз при инициализации экрана)
	useEffect(() => {
		log.info('mount');
	}, [log]);

	useEffect(() => {
		if (fetchState !== 'loading') return;
		let cancelled = false;
		log.info('fetch:start', { cachedCount: tickets.length });
		ticketApi
			.getMyTickets()
			.then(data => {
				if (!cancelled) setTickets(data);
				if (!cancelled) setFetchState('loaded');
				if (!cancelled)
					log.info('fetch:success', { count: data.length });
			})
			.catch(e => {
				if (!cancelled) {
					setFetchState('error');
					log.error('fetch:error', {
						message: e?.message || 'unknown',
					});
				}
			});
		return () => {
			cancelled = true;
		};
	}, [fetchState, setTickets, tickets.length, log]);

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
		// Прошедшие билеты (до начала сегодняшнего дня) — сейчас не показывались,
		// из-за чего пользователь мог подумать, что билет "пропал", если выбрал дату в прошлом.
		const past = filteredTickets.filter(
			t => new Date(t.departureTime) < startOfToday,
		);

		const byAsc = (a: Ticket, b: Ticket) =>
			+new Date(a.departureTime) - +new Date(b.departureTime);
		const byDesc = (a: Ticket, b: Ticket) =>
			+new Date(b.departureTime) - +new Date(a.departureTime);

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

	const isLoading = fetchState === 'loading';
	const showEmpty = fetchState === 'loaded' && !tickets.length;

	const imageNode = (
		<View>
			<Image
				source={tickets_empty}
				style={[styles.image, styles.imageRotated]}
			/>
			<Image source={tickets_empty} style={styles.image} />
		</View>
	);

	const actionNode = (
		<AppButton
			onPress={() => router.push('/tickets/add')}
			buttonBorderRadius={Radius.r16}
			textFontSize={Fonts.f16}
			textFontFamily={Fonts.medium}
			style={styles.addButtonEmpty}
		>
			<View style={styles.addButtonContent}>
				<AddTicketIcon />
				<AppText variant='button' style={styles.addButtonText}>
					Добавить билет
				</AppText>
			</View>
		</AppButton>
	);

	return (
		<SafeAreaView style={styles.root}>
			<Header title='Мои билеты' />

			{isLoading ? (
				<View style={styles.loadingWrap} testID='tickets-loading'>
					<ActivityIndicator
						size='large'
						color={Colors.greenPrimary}
					/>
				</View>
			) : fetchState === 'error' ? (
				<View style={styles.loadingWrap} testID='tickets-error'>
					<AppText style={styles.errorText}>
						Упс! Что-то пошло не так. Пожалуйста, попробуйте еще
						раз.
					</AppText>
				</View>
			) : showEmpty ? (
				<View style={styles.emptyContainer}>
					<EmptyState
						title='Билетов пока нет'
						description='Здесь можно хранить свои билеты на различные мероприятия или рейсы'
						image={imageNode}
						action={actionNode}
						testId='tickets-empty'
					/>
				</View>
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
						<View style={styles.list} testID='tickets-list'>
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
											<NewTicketItem
												ticket={t as Ticket}
											/>
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
		// ...Platform.select({
		// 	ios: {
		// 		shadowColor: 'rgba(169, 169, 169, 0.25)',
		// 		shadowOffset: { width: 2, height: 4 },
		// 		shadowOpacity: 1,
		// 		shadowRadius: 6,
		// 	},
		// 	android: {
		// 		elevation: 8,
		// 	},
		// }),
	},
	addButtonContent: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: Gaps.g8,
	},
	addButtonEmpty: { height: 52, width: '100%' },
	addButtonText: {
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
	},
	cardWrap: { marginBottom: 8 },
	emptyContainer: {
		flex: 1,
		justifyContent: 'flex-start',
		paddingTop: 80,
	},
	errorText: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
		marginBottom: 16,
		textAlign: 'center',
	},
	fabContainer: {
		alignItems: 'center',
		bottom: 58,
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
	image: {
		alignSelf: 'center',
		height: 265,
		justifyContent: 'center',
		marginBottom: Gaps.g20,
		resizeMode: 'contain',
		width: 265,
	},
	imageRotated: { position: 'absolute', transform: [{ rotate: '-15deg' }] },
	list: {
		gap: 16,
		paddingHorizontal: 20,
		// paddingTop: 24,
	},
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
