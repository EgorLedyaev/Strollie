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
		paddingTop: 16,
		paddingHorizontal: 16,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBottom: 14,
	},
	headerTitle: {
		fontSize: Fonts.f16,
		fontFamily: Fonts.bold,
		color: Colors.headerAndInputText,
		maxWidth: '70%',
		textAlign: 'center',
	},
	headerSpacer: { width: 32, height: 32 },
	content: {
		flex: 1,
	},
	scrollContent: { paddingBottom: 32, rowGap: Gaps.g16 },
	center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

	// Даты
	sectionDates: {
		marginTop: 20,
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		paddingVertical: 20,
		paddingHorizontal: 24,
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 32,
	},
	dateBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	dateLabel: { color: Colors.textGrayB7, fontSize: Fonts.f14 },
	dateValue: {
		color: Colors.darkGrayText43,
		fontSize: Fonts.f16,
		fontFamily: Fonts.semibold,
	},

	// Общая секция
	section: { rowGap: Gaps.g12 },
	sectionHeaderRow: {
		marginTop: 24,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	sectionTitle: {
		color: Colors.headerAndInputText,
		fontSize: Fonts.f16,
		fontFamily: Fonts.bold,
	},
	rowGap10: { flexDirection: 'row', alignItems: 'center', gap: 10 },
	smallSquareWhite: {
		width: 32,
		height: 32,
		borderRadius: Radius.r8,
		backgroundColor: Colors.white,
		alignItems: 'center',
		justifyContent: 'center',
	},
	smallSquareGreen: {
		width: 32,
		height: 32,
		borderRadius: Radius.r8,
		backgroundColor: Colors.successGreen,
		alignItems: 'center',
		justifyContent: 'center',
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
		position: 'absolute',
		left: 6,
		top: 10,
		bottom: 10,
		width: 8,
		borderRadius: 5,
		backgroundColor: Colors.gray,
	},
	placeRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 24,
		marginBottom: 20,
	},
	placeDot: { width: 20, height: 20, borderRadius: 10, },
	placeDotActive: { backgroundColor: Colors.greenPrimary },
	placeDotInactive: { backgroundColor: Colors.grayMedium },
	placeText: { color: Colors.headerAndInputText, fontSize: Fonts.f14 },

	// Чек-лист
	checklistBox: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		paddingVertical: 20,
		paddingHorizontal: 10,
		rowGap: 8,
	},
	taskRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 8,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: Colors.grayAvatar,
	},
	checkboxChecked: {
		width: 20,
		height: 20,
		borderRadius: 4,
		backgroundColor: Colors.grayAvatar,
		alignItems: 'center',
		justifyContent: 'center',
	},
	checkmark: { color: Colors.white, fontSize: Fonts.f14 },
	taskText: {
		flex: 1,
		color: Colors.headerAndInputText,
		fontSize: Fonts.f14,
	},
	removeIcon: {
		width: 12,
		textAlign: 'center',
		color: Colors.grayText,
		fontSize: Fonts.f12,
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
		fontSize: Fonts.f16,
		fontFamily: Fonts.bold,
	},
	routeMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
	routeMeta: { color: Colors.headerAndInputText, fontSize: Fonts.f14 },

	// Заметки
	notesBox: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		paddingVertical: 16,
		paddingHorizontal: 10,
	},
	notesText: { color: Colors.headerAndInputText, fontSize: Fonts.f14 },

	// Низ
	bottomRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
		marginTop: 8,
	},
	bottomDelete: { height: 44, flex: 1 },
	bottomSave: { height: 44, flex: 2 },
});