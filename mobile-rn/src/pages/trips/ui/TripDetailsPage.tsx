import PlusIcon from '@/assets/icons/action/PlusIcon';
import EditPhotoIcon from '@/assets/icons/EditPhotoIcon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tripsApi } from '@/pages/trips/api';
import { Ticket, ticketApi, TicketCard } from '@/entities/ticket';
import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppButton, AppText, BackButton, IconButton } from '@/shared/ui';
import { PlusButton } from '@/shared/ui/PlusButton';

function pad2(n: number) {
	return n < 10 ? `0${n}` : `${n}`;
}
function formatDate(d: Date) {
	return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

type Place = { id: string; name: string; active?: boolean };
type Task = { id: string; text: string; done: boolean };

type TripVm = {
	id: string;
	title: string;
	displayTitle: string;
	start: Date;
	end: Date;
	ticketIds: string[];
};

export const TripDetailsPage: React.FC = () => {
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [trip, setTrip] = useState<TripVm | null>(null);
	const [tickets, setTickets] = useState<Ticket[]>([]);

	// Временные мок-данные для секций (уровень pages)
	const [places] = useState<Place[]>([
		{ id: 'p1', name: 'Цирк имени Братьев Никитиных', active: true },
		{ id: 'p2', name: 'ТЮЗ им. Ю.П. Киселёва' },
		{ id: 'p3', name: 'Парк Липки' },
		{ id: 'p4', name: 'Набережная Космонавтов' },
	]);
	const [tasks] = useState<Task[]>([
		{ id: 't1', text: 'Посетить журавлей в парке Победы', done: true },
		{ id: 't2', text: 'Сходить в Тары-Бары', done: false },
		{
			id: 't3',
			text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras faucibus tellus felis, vel vehicula tortor aliquet ultrices.',
			done: false,
		},
	]);

	useEffect(() => {
		(async () => {
			if (!id || Array.isArray(id)) return;
			setLoading(true);
			const [trps, allTickets] = await Promise.all([
				tripsApi.getMyTrips(),
				ticketApi.getMyTickets(),
			]);
			const tMap: Record<string, { to: string }> = {};
			for (const tk of allTickets) tMap[tk.id] = { to: tk.to };

			const found = trps.find(t => t.id === id);
			if (found) {
				const firstTicket = found.ticketIds[0]
					? tMap[found.ticketIds[0]]
					: undefined;
				const displayTitle = firstTicket
					? `Поездка в ${firstTicket.to}`
					: found.name;

				const vm: TripVm = {
					id: found.id,
					title: found.name,
					displayTitle,
					start: found.startDate,
					end: found.endDate,
					ticketIds: found.ticketIds,
				};
				setTrip(vm);
				setTickets(
					allTickets.filter(tk => found.ticketIds.includes(tk.id)),
				);
			}
			setLoading(false);
		})();
	}, [id]);

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.headerRow}>
					<BackButton onPress={() => router.back()} variant='icon' />
					<AppText style={styles.headerTitle}>Поездка</AppText>
					<View style={styles.headerSpacer} />
				</View>
				<View style={styles.center}>
					<ActivityIndicator />
				</View>
			</SafeAreaView>
		);
	}

	if (!trip) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.headerRow}>
					<BackButton onPress={() => router.back()} variant='icon' />
					<AppText style={styles.headerTitle}>Поездка</AppText>
					<View style={styles.headerSpacer} />
				</View>
				<View style={styles.center}>
					<AppText>Поездка не найдена</AppText>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			{/* Шапка */}
			<View style={styles.headerRow}>
				<BackButton onPress={() => router.back()} variant='icon' />
				<AppText style={styles.headerTitle} numberOfLines={1}>
					{trip.displayTitle}
				</AppText>
				<View style={styles.headerSpacer} />
			</View>

			<FlatList
				data={[{ key: 'content' }]}
				keyExtractor={i => i.key}
				renderItem={() => (
					<View style={styles.content}>
						{/* Даты */}
						<View style={styles.sectionDates}>
							<View style={styles.dateBox}>
								<AppText style={styles.dateLabel}>
									Начало
								</AppText>
								<AppText style={styles.dateValue}>
									{formatDate(trip.start)}
								</AppText>
							</View>
							<View style={styles.dateBox}>
								<AppText style={styles.dateLabel}>
									Конец
								</AppText>
								<AppText style={styles.dateValue}>
									{formatDate(trip.end)}
								</AppText>
							</View>
						</View>

						{/* Билеты */}
						<View style={styles.section}>
							<View style={styles.sectionHeaderRow}>
								<AppText style={styles.sectionTitle}>
									Билеты
								</AppText>
								<PlusButton onPress={() => {}} />
							</View>
							{tickets.length > 0 ? (
								<View style={styles.ticketsWrap}>
									{tickets.map(t => (
										<View
											style={styles.ticketItem}
											key={t.id}
										>
											<TicketCard ticket={t} />
										</View>
									))}
								</View>
							) : null}
						</View>

						{/* Места */}
						<View style={styles.section}>
							<View style={styles.sectionHeaderRow}>
								<AppText style={styles.sectionTitle}>
									Места
								</AppText>
								<PlusButton onPress={() => {}} />
							</View>
							<View style={styles.placesBox}>
								<View style={styles.placesLine} />
								{places.map(p => (
									<View style={styles.placeRow} key={p.id}>
										<View
											style={[
												styles.placeDot,
												p.active
													? styles.placeDotActive
													: styles.placeDotInactive,
											]}
										/>
										<AppText style={styles.placeText}>
											{p.name}
										</AppText>
									</View>
								))}
							</View>
						</View>

						{/* Чек-лист */}
						<View style={styles.section}>
							<View style={styles.sectionHeaderRow}>
								<AppText style={styles.sectionTitle}>
									Чек-лист
								</AppText>
								<View style={styles.rowGap10}>
									<IconButton>
										<View style={styles.smallSquareGreen}>
											<EditPhotoIcon />
										</View>
									</IconButton>
									<IconButton>
										<View style={styles.smallSquareWhite}>
											<PlusIcon />
										</View>
									</IconButton>
								</View>
							</View>
							<View style={styles.checklistBox}>
								{tasks.map(task => (
									<View style={styles.taskRow} key={task.id}>
										<View
											style={
												task.done
													? styles.checkboxChecked
													: styles.checkbox
											}
										>
											{task.done ? (
												<AppText
													style={styles.checkmark}
												>
													✓
												</AppText>
											) : null}
										</View>
										<AppText style={styles.taskText}>
											{task.text}
										</AppText>
										<AppText style={styles.removeIcon}>
											×
										</AppText>
									</View>
								))}
							</View>
						</View>

						{/* Маршруты */}
						<View style={styles.section}>
							<View style={styles.sectionHeaderRow}>
								<AppText style={styles.sectionTitle}>
									Маршруты
								</AppText>
								<View style={styles.rowGap10}>
									<IconButton>
										<View style={styles.smallSquareWhite}>
											<PlusIcon />
										</View>
									</IconButton>
								</View>
							</View>
							<View style={styles.routeCard}>
								<AppText style={styles.routeTitle}>
									Название маршрута
								</AppText>
								<View style={styles.routeMetaRow}>
									<AppText style={styles.routeMeta}>
										Из 1 точки
									</AppText>
									<AppText style={styles.routeMeta}>
										В последнюю точку
									</AppText>
								</View>
							</View>
						</View>

						{/* Заметки */}
						<View style={styles.section}>
							<AppText style={styles.sectionTitle}>
								Заметки
							</AppText>
							<View style={styles.notesBox}>
								<AppText style={styles.notesText}>
									Lorem ipsum dolor sit amet, consectetur
									adipiscing elit. Cras faucibus tellus felis,
									vel vehicula tortor aliquet ultrices.
									Aliquam consectetur urna felis, sed commodo
									quam tempus sit amet. Quisque ac lectus
									vitae sem molestie tincidunt vel sed magna
								</AppText>
							</View>
						</View>

						{/* Нижние кнопки */}
						<View style={styles.bottomRow}>
							<AppButton
								text='Удалить'
								variant='secondary'
								buttonColor={Colors.white}
								textColor={Colors.red}
								style={styles.bottomDelete}
							/>
							<AppButton
								text='Сохранить поездку'
								style={styles.bottomSave}
							/>
						</View>
					</View>
				)}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	headerRow: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: 14,
	},
	headerTitle: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
		maxWidth: '70%',
		textAlign: 'center',
	},
	headerSpacer: { height: 32, width: 32 },
	content: {
		flex: 1,
	},
	scrollContent: { paddingBottom: 32, rowGap: Gaps.g16 },
	center: { alignItems: 'center', flex: 1, justifyContent: 'center' },

	// Даты
	sectionDates: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		flexDirection: 'row',
		gap: 32,
		justifyContent: 'space-between',
		marginTop: 20,
		paddingHorizontal: 24,
		paddingVertical: 20,
	},
	dateBox: { alignItems: 'center', flexDirection: 'row', gap: 8 },
	dateLabel: { color: Colors.textGrayB7, fontSize: Fonts.f14 },
	dateValue: {
		color: Colors.darkGrayText43,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
	},

	// Общая секция
	section: { rowGap: Gaps.g12 },
	sectionHeaderRow: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 24,
	},
	sectionTitle: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
	},
	rowGap10: { alignItems: 'center', flexDirection: 'row', gap: 10 },
	smallSquareWhite: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r8,
		height: 32,
		justifyContent: 'center',
		width: 32,
	},
	smallSquareGreen: {
		alignItems: 'center',
		backgroundColor: Colors.successGreen,
		borderRadius: Radius.r8,
		height: 32,
		justifyContent: 'center',
		width: 32,
	},

	// Билеты
	ticketsWrap: { gap: 12 },
	ticketItem: { marginBottom: 0 },

	// Места
	placesBox: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		paddingHorizontal: 24,
		paddingVertical: 20,
	},
	placesLine: {
		backgroundColor: Colors.gray,
		borderRadius: 5,
		bottom: 10,
		left: 6,
		position: 'absolute',
		top: 10,
		width: 8,
	},
	placeRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 24,
		marginBottom: 20,
	},
	placeDot: { borderRadius: 10, height: 20, width: 20 },
	placeDotActive: { backgroundColor: Colors.greenPrimary },
	placeDotInactive: { backgroundColor: Colors.grayMedium },
	placeText: { color: Colors.headerAndInputText, fontSize: Fonts.f14 },

	// Чек-лист
	checklistBox: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		paddingHorizontal: 10,
		paddingVertical: 20,
		rowGap: 8,
	},
	taskRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 8,
		justifyContent: 'space-between',
	},
	checkbox: {
		borderColor: Colors.grayAvatar,
		borderRadius: 4,
		borderWidth: 2,
		height: 20,
		width: 20,
	},
	checkboxChecked: {
		alignItems: 'center',
		backgroundColor: Colors.grayAvatar,
		borderRadius: 4,
		height: 20,
		justifyContent: 'center',
		width: 20,
	},
	checkmark: { color: Colors.white, fontSize: Fonts.f14 },
	taskText: {
		color: Colors.headerAndInputText,
		flex: 1,
		fontSize: Fonts.f14,
	},
	removeIcon: {
		color: Colors.grayText,
		fontSize: Fonts.f12,
		textAlign: 'center',
		width: 12,
	},

	// Маршруты
	routeCard: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		padding: 20,
		rowGap: 12,
	},
	routeTitle: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
	},
	routeMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
	routeMeta: { color: Colors.headerAndInputText, fontSize: Fonts.f14 },

	// Заметки
	notesBox: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		paddingHorizontal: 10,
		paddingVertical: 16,
	},
	notesText: { color: Colors.headerAndInputText, fontSize: Fonts.f14 },

	// Низ
	bottomRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 16,
		marginTop: 8,
	},
	bottomDelete: { flex: 1, height: 44 },
	bottomSave: { flex: 2, height: 44 },
});
