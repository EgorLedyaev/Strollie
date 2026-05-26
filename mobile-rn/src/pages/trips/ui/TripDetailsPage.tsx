import PlusIcon from '@/assets/icons/action/PlusIcon';
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
import {
	TripChecklistItem,
	useDeleteTripMutation,
	useTripDetailsQuery,
	useUpdateTripMutation,
} from '@/entities/trip';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import {
	ActionTouchable,
	AppButton,
	AppText,
	AppTextInput,
	EditButton,
	SectionItem,
} from '@/shared/ui';

import { Place, PlacesSection } from './PlacesSection';

function formatDate(d: Date | string) {
	const date = typeof d === 'string' ? parseISO(d) : d;
	return format(date, 'dd.MM.yyyy', { locale: ru });
}

export const TripDetailsPage: React.FC = () => {
	const { id } = useLocalSearchParams<{ id: string }>();

	// Queries & Mutations
	const { data: trip, isLoading: isTripLoading } = useTripDetailsQuery(id!);
	const updateTripMutation = useUpdateTripMutation();
	const deleteTripMutation = useDeleteTripMutation();

	// Local State for Editing
	const [placesMode, setPlacesMode] = useState<'view' | 'route'>('view');
	const [selectedRoutePlaces, setSelectedRoutePlaces] = useState<string[]>(
		[],
	);

	// Checklist & Notes Local State (for Edit Mode)
	const [localChecklist, setLocalChecklist] = useState<TripChecklistItem[]>(
		[],
	);
	const [checklistMode, setChecklistMode] = useState<'view' | 'edit'>('view');
	const [isAddingChecklistItem, setIsAddingChecklistItem] = useState(false);
	const [editableNotes, setEditableNotes] = useState('');

	// Tickets State
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [editingTickets, setEditingTickets] = useAtom(editingTripTicketsAtom);

	// Mock Places
	const [places] = useState<Place[]>([
		{ id: 'p1', name: 'Цирк имени Братьев Никитиных', visited: true },
		{ id: 'p2', name: 'ТЮЗ им. Ю.П. Киселёва' },
		{ id: 'p3', name: 'Парк Липки', visited: true },
		{ id: 'p4', name: 'Набережная Космонавтов' },
	]);

	// Sync Trip Data to Local State
	useEffect(() => {
		if (trip) {
			setLocalChecklist(trip.checklist);
			setEditableNotes(trip.notes || '');
			// Fetch tickets for this trip
			ticketApi.getMyTickets().then(allTickets => {
				setTickets(
					allTickets.filter(t => trip.ticketIds.includes(t.id)),
				);
			});
		}
	}, [trip]);

	// Ticket Selection Return Handler (Auto-save)
	useFocusEffect(
		useCallback(() => {
			if (editingTickets !== null && trip) {
				const newTicketIds = editingTickets.map(t => t.id);
				setTickets(editingTickets);
				updateTripMutation.mutate({
					id: trip.id,
					data: {
						ticketIds: newTicketIds,
						checklist: trip.checklist,
						notes: trip.notes || '',
						places: trip.places,
					},
				});
				setEditingTickets(null);
			}
		}, [editingTickets, setEditingTickets, trip, updateTripMutation]),
	);

	const handleBuildRouteClick = () => {
		if (placesMode === 'view') {
			setPlacesMode('route');
			setSelectedRoutePlaces([]);
		} else {
			console.log('Route built:', selectedRoutePlaces);
			setPlacesMode('view');
		}
	};

	const togglePlaceSelection = (placeId: string) => {
		setSelectedRoutePlaces(prev =>
			prev.includes(placeId)
				? prev.filter(id => id !== placeId)
				: [...prev, placeId],
		);
	};

	// View Mode: Immediate Toggle
	const handleToggleChecklistItem = (idToToggle: string) => {
		if (checklistMode !== 'view' || !trip) return;

		const updatedChecklist = trip.checklist.map(item =>
			item.id === idToToggle ? { ...item, done: !item.done } : item,
		);

		updateTripMutation.mutate({
			id: trip.id,
			data: {
				checklist: updatedChecklist,
				notes: trip.notes || '',
				ticketIds: trip.ticketIds,
				places: trip.places,
			},
		});
	};

	// Edit Mode: Local State Manipulation
	const handleDeleteChecklistItem = (idToDelete: string) => {
		setLocalChecklist(prev => prev.filter(item => item.id !== idToDelete));
	};

	const handleConfirmAddChecklistItem = (text: string) => {
		const newItem: TripChecklistItem = {
			id: `checklist_${Date.now()}`,
			text,
			done: false,
		};
		setLocalChecklist(prev => [...prev, newItem]);
		setIsAddingChecklistItem(false);
	};

	// Save Changes (Edit Mode)
	const handleSave = () => {
		if (!trip) return;

		updateTripMutation.mutate(
			{
				id: trip.id,
				data: {
					checklist: localChecklist,
					notes: editableNotes,
					ticketIds: trip.ticketIds,
					places: trip.places,
				},
			},
			{
				onSuccess: () => {
					setChecklistMode('view');
					router.back();
				},
			},
		);
	};

	const handleDelete = () => {
		if (!trip) return;
		deleteTripMutation.mutate(trip.id, {
			onSuccess: () => {
				router.back();
			},
		});
	};

	if (isTripLoading) {
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

	const displayTitle = trip.title || 'Поездка';
	const firstTicket = tickets.find(t => t.id === trip.ticketIds[0]);
	const finalDisplayTitle = firstTicket
		? `Поездка в ${firstTicket.to}`
		: displayTitle;

	return (
		<SafeAreaView style={styles.container}>
			<Header title={finalDisplayTitle} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View>
					{/* Dates */}
					<View style={styles.dateContainer}>
						<View style={styles.dateBlock}>
							<AppText style={styles.dateLabel}>Начало</AppText>
							<AppText style={styles.dateValue}>
								{formatDate(trip.startDate)}
							</AppText>
						</View>
						<View style={styles.dateBlock}>
							<AppText style={styles.dateLabel}>Конец</AppText>
							<AppText style={styles.dateValue}>
								{formatDate(trip.endDate)}
							</AppText>
						</View>
					</View>

					{/* Tickets */}
					<View style={styles.sectionsContainer}>
						<SectionItem
							label={'Билеты'}
							onPress={() => {
								setEditingTickets(tickets);
								router.push('/trips/select-ticket?mode=edit');
							}}
						/>
						<View style={styles.ticketsContainer}>
							{tickets.map(t => (
								<NewTicketItem key={t.id} ticket={t} />
							))}
						</View>

						<PlacesSection
							places={places}
							mode={placesMode}
							selectedIds={selectedRoutePlaces}
							onBuildRouteClick={handleBuildRouteClick}
							onPlaceSelect={togglePlaceSelection}
						/>

						{/* Checklist */}
						<View>
							<View style={styles.sectionHeaderRow}>
								<AppText style={styles.sectionTitle}>
									Чек-лист
								</AppText>
								<View style={styles.rowGap10}>
									<EditButton
										onPress={() =>
											setChecklistMode(prev =>
												prev === 'view'
													? 'edit'
													: 'view',
											)
										}
										size={32}
										borderRadius={Radius.r8}
										backgroundColor={
											checklistMode === 'edit'
												? Colors.successGreen
												: Colors.white
										}
										iconColor={
											checklistMode === 'edit'
												? Colors.white
												: Colors.textAAA
										}
									/>
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

							{(checklistMode === 'view'
								? trip.checklist
								: localChecklist
							).length > 0 && (
								<View style={styles.checklistBox}>
									{(checklistMode === 'view'
										? trip.checklist
										: localChecklist
									).map(item => (
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

					{/* Notes */}
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
									{trip.notes || 'У вас пока нет заметок.'}
								</AppText>
							</View>
						)}
					</View>

					{/* Bottom Buttons */}
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
							isLoading={deleteTripMutation.isPending}
						/>
						<AppButton
							text='Сохранить поездку'
							style={styles.bottomSave}
							textFontFamily={Fonts.regular}
							buttonBorderRadius={Radius.r16}
							onPress={handleSave}
							isLoading={updateTripMutation.isPending}
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
