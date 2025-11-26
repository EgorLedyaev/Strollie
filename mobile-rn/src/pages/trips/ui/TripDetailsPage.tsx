import PlusIcon from '@/assets/icons/action/PlusIcon';
import EditPhotoIcon from '@/assets/icons/EditPhotoIcon';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/widgets/header';
import { editingTripTicketsAtom } from '@/features/manage-trips';
import { ChecklistInput, ChecklistItem } from '@/features/trip-checklist';
import { NewTicketItem, Ticket, ticketApi } from '@/entities/ticket';
import { tripApi, TripChecklistItem, UpdateTripInput } from '@/entities/trip';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import {
	ActionTouchable,
	AppButton,
	AppText,
	AppTextInput,
	SectionItem,
} from '@/shared/ui';

import { Place, PlacesSection } from './PlacesSection';

function formatDate(d: Date) {
	return format(d, 'dd.MM.yyyy', { locale: ru });
}

type TripVm = {
	id: string;
	title: string;
	displayTitle: string;
	start: Date;
	end: Date;
	ticketIds: string[];
	checklist: TripChecklistItem[];
	notes: string;
};

export const TripDetailsPage: React.FC = () => {
	const { id } = useLocalSearchParams();
	// const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [trip, setTrip] = useState<TripVm | null>(null);
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [placesMode, setPlacesMode] = useState<'view' | 'route'>('view');
	const [selectedRoutePlaces, setSelectedRoutePlaces] = useState<string[]>(
		[],
	);
	const [checklist, setChecklist] = useState<TripChecklistItem[]>([]);
	const [checklistMode, setChecklistMode] = useState<'view' | 'edit'>('view');
	const [isAddingChecklistItem, setIsAddingChecklistItem] = useState(false);
	const [editableNotes, setEditableNotes] = useState('');
	const [, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const [editingTickets, setEditingTickets] = useAtom(editingTripTicketsAtom);

	// Временные мок-данные для секций (уровень pages)
	const [places] = useState<Place[]>([
		{ id: 'p1', name: 'Цирк имени Братьев Никитиных', visited: true },
		{ id: 'p2', name: 'ТЮЗ им. Ю.П. Киселёва' },
		{ id: 'p3', name: 'Парк Липки', visited: true },
		{ id: 'p4', name: 'Набережная Космонавтов' },
	]);

	const handleBuildRouteClick = () => {
		if (placesMode === 'view') {
			setPlacesMode('route');
			setSelectedRoutePlaces([]);
		} else {
			console.log(
				'Нажата кнопка Построить маршрут с точками:',
				selectedRoutePlaces,
			);
			setPlacesMode('view');
		}
	};
	const togglePlaceSelection = (placeId: string) => {
		setSelectedRoutePlaces(prevSelected => {
			if (prevSelected.includes(placeId)) {
				return prevSelected.filter(id => id !== placeId);
			} else {
				return [...prevSelected, placeId];
			}
		});
	};

	const handleToggleChecklistItem = (idToToggle: string) => {
		if (checklistMode !== 'view') return;
		setChecklist(currentList =>
			currentList.map(item =>
				item.id === idToToggle ? { ...item, done: !item.done } : item,
			),
		);
	};

	const handleDeleteChecklistItem = (idToDelete: string) => {
		setChecklist(currentList =>
			currentList.filter(item => item.id !== idToDelete),
		);
	};

	const handleConfirmAddChecklistItem = (text: string) => {
		const newItem: TripChecklistItem = {
			id: `checklist_${Date.now()}`,
			text,
			done: false,
		};
		setChecklist(prev => [...prev, newItem]);
		setIsAddingChecklistItem(false);
	};
	const handleSave = async () => {
		if (!trip) return;

		setIsSaving(true);

		const updatedData: UpdateTripInput = {
			checklist: checklist,
			notes: editableNotes,
			ticketIds: tickets.map(t => t.id), // Преобразуем массив билетов в массив ID
			places: places.map(p => p.id), // Преобразуем массив мест в массив ID
		};

		try {
			await tripApi.updateTrip(trip.id, updatedData);
			console.log('Поездка успешно сохранена!');
			setChecklistMode('view');
			router.back();
		} catch (error) {
			console.error('Ошибка при сохранении поездки:', error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!trip || isDeleting) return;
		setIsDeleting(true);
		try {
			await tripApi.deleteTrip(trip.id);
			console.log('Поездка успешно удалена!');
			router.back();
		} catch (error) {
			console.error('Ошибка при удалении поездки:', error);
		} finally {
			setIsDeleting(false);
		}
	};

	useEffect(() => {
		(async () => {
			if (!id || Array.isArray(id)) return;
			setLoading(true);
			const [trps, allTickets] = await Promise.all([
				tripApi.getMyTrips({ force: true }),
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
					: found.title || 'Поездка';

				const vm: TripVm = {
					id: found.id,
					title: found.title || 'Поездка',
					displayTitle,
					start: parseISO(found.startDate),
					end: parseISO(found.endDate),
					ticketIds: found.ticketIds,
					checklist: found.checklist,
					notes: found.notes || '',
				};
				setTrip(vm);
				setTickets(
					allTickets.filter(tk => found.ticketIds.includes(tk.id)),
				);
			}
			setLoading(false);
		})();
	}, [id]);

	useEffect(() => {
		if (trip) {
			setChecklist(trip.checklist);
			setEditableNotes(trip.notes || '');
		}
	}, [trip]);

	useFocusEffect(
		useCallback(() => {
			if (editingTickets !== null) {
				setTickets(editingTickets);
				setEditingTickets(null);
			}
		}, [editingTickets, setEditingTickets]),
	);

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<Header title={'Поездка'} />
				<View style={styles.center}>
					<ActivityIndicator />
				</View>
			</SafeAreaView>
		);
	}

	if (!trip) {
		return (
			<SafeAreaView style={styles.container}>
				<Header title={'Поездка'} />
				<View style={styles.center}>
					<AppText>Поездка не найдена</AppText>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<Header title={trip.displayTitle} />
			<ScrollView
				// contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View>
					{/* Даты */}
					<View style={styles.dateContainer}>
						<View style={styles.dateBlock}>
							<AppText style={styles.dateLabel}>Начало</AppText>
							<AppText style={styles.dateValue}>
								{formatDate(trip.start)}
							</AppText>
						</View>
						<View style={styles.dateBlock}>
							<AppText style={styles.dateLabel}>Конец</AppText>
							<AppText style={styles.dateValue}>
								{formatDate(trip.end)}
							</AppText>
						</View>
					</View>
					{/* Билеты */}
					<View style={styles.sectionsContainer}>
						<SectionItem
							label={'Билеты'}
							onPress={() => {
								setEditingTickets(tickets);
								router.push('/trips/select-ticket?mode=edit');
							}}
						/>
						<View style={styles.ticketsContainer}>
							{tickets.length > 0 && (
								<View style={styles.ticketsContainer}>
									{tickets.map(t => (
										<NewTicketItem key={t.id} ticket={t} />
									))}
								</View>
							)}
						</View>

						<PlacesSection
							places={places}
							mode={placesMode}
							selectedIds={selectedRoutePlaces}
							onBuildRouteClick={handleBuildRouteClick}
							onPlaceSelect={togglePlaceSelection}
						/>

						{/* Чек-лист */}
						<View>
							<View style={styles.sectionHeaderRow}>
								<AppText style={styles.sectionTitle}>
									Чек-лист
								</AppText>
								<View style={styles.rowGap10}>
									<ActionTouchable
										onPress={() =>
											setChecklistMode(prev =>
												prev === 'view'
													? 'edit'
													: 'view',
											)
										}
									>
										<View
											style={
												checklistMode === 'edit'
													? styles.smallSquareGreen
													: styles.smallSquareWhite
											}
										>
											<EditPhotoIcon
												color={
													checklistMode === 'edit'
														? Colors.white
														: Colors.textAAA
												}
											/>
										</View>
									</ActionTouchable>
									<ActionTouchable
										onPress={() =>
											setIsAddingChecklistItem(
												!isAddingChecklistItem,
											)
										}
									>
										<View style={styles.smallSquareWhite}>
											<PlusIcon />
										</View>
									</ActionTouchable>
								</View>
							</View>
							{checklist.length > 0 && (
								<View style={styles.checklistBox}>
									{checklist.map(item => (
										<ChecklistItem
											key={item.id}
											item={item}
											onToggle={
												checklistMode === 'view'
													? handleToggleChecklistItem
													: undefined
											}
											onDelete={
												checklistMode === 'edit'
													? handleDeleteChecklistItem
													: undefined
											}
											showDelete={
												checklistMode === 'edit'
											}
										/>
									))}
								</View>
							)}
							{isAddingChecklistItem && (
								<View style={styles.inputWrapper}>
									<ChecklistInput
										onAdd={handleConfirmAddChecklistItem}
									/>
								</View>
							)}
						</View>
					</View>

					{/* Заметки */}
					<View style={styles.notesContainer}>
						<AppText style={styles.sectionTitle}>Заметки</AppText>
						{checklistMode === 'edit' ? (
							<AppTextInput
								value={editableNotes}
								onChangeText={setEditableNotes}
								style={styles.notesInput}
								multiline
								placeholder='Введите текст того, что вы хотели записать или дополнить'
								placeholderTextColor={Colors.grayMedium}
							/>
						) : (
							<View style={styles.notesBox}>
								<AppText style={styles.notesText}>
									{editableNotes || 'У вас пока нет заметок.'}
								</AppText>
							</View>
						)}
					</View>

					{/* Нижние кнопки */}
					<View style={styles.bottomRow}>
						<AppButton
							text='Удалить'
							variant='secondary'
							buttonColor={Colors.white}
							textColor={Colors.red}
							style={styles.bottomDelete}
							textFontFamily={Fonts.regular}
							buttonBorderRadius={Radius.r16}
							onPress={handleDelete}
						/>
						<AppButton
							text='Сохранить поездку'
							style={styles.bottomSave}
							textFontFamily={Fonts.regular}
							buttonBorderRadius={Radius.r16}
							onPress={handleSave}
						/>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	bottomDelete: {
		flex: 1,
		height: 44,
	},
	bottomRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 16,
		marginTop: 20,
	},
	bottomSave: {
		flex: 2,
		height: 44,
	},
	center: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
	checklistBox: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		marginVertical: 10,
		padding: 16,
	},
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	dateBlock: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 8,
		justifyContent: 'center',
	},
	dateContainer: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 24,
		paddingHorizontal: 24,
		paddingVertical: 20,
	},
	dateLabel: {
		color: Colors.textGrayB7,
		fontSize: Fonts.f14,
	},
	dateValue: {
		color: Colors.darkGrayText43,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
	},
	inputWrapper: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		marginTop: 8,
	},
	notesBox: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		minHeight: 120,
		padding: 16,
	},
	notesContainer: {
		gap: 12,
		marginTop: 20,
	},
	notesInput: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		color: Colors.headerAndInputText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
		height: 120,
		padding: 16,
		textAlignVertical: 'top',
	},
	notesText: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
	},
	rowGap10: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 10,
	},
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
	sectionsContainer: {
		// paddingTop: 30,
	},
	smallSquareGreen: {
		alignItems: 'center',
		backgroundColor: Colors.successGreen,
		borderRadius: Radius.r8,
		height: 32,
		justifyContent: 'center',
		width: 32,
	},
	smallSquareWhite: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r8,
		height: 32,
		justifyContent: 'center',
		width: 32,
	},
	ticketsContainer: {
		gap: 16,
	},
});
