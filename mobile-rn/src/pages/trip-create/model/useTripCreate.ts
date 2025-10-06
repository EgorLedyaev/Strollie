import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';

import { tripApi, TripChecklistItem } from '@/entities/trip';

import {
	checklistAtom,
	endDateAtom,
	isSubmittingAtom,
	notesAtom,
	placesAtom,
	routesAtom,
	selectedTicketsAtom,
	startDateAtom,
} from './state';

export const useTripCreate = () => {
	const router = useRouter();

	// Локальное UI состояние
	const [isPickerVisible, setPickerVisible] = useState(false);
	const [editingDateType, setEditingDateType] = useState<'start' | 'end'>(
		'start',
	);
	const [isAddingChecklistItem, setIsAddingChecklistItem] = useState(false);

	// Глобальное состояние формы (Jotai)
	const [startDate, setStartDate] = useAtom(startDateAtom);
	const [endDate, setEndDate] = useAtom(endDateAtom);
	const [selectedTickets, setSelectedTickets] = useAtom(selectedTicketsAtom);
	const [places, setPlaces] = useAtom(placesAtom);
	const [routes, setRoutes] = useAtom(routesAtom);
	const [checklist, setChecklist] = useAtom(checklistAtom);
	const [notes, setNotes] = useAtom(notesAtom);
	const [isSubmitting, setSubmitting] = useAtom(isSubmittingAtom);

	// Производные состояния и логика
	const canSave = startDate && endDate && !isSubmitting;

	const resetForm = useCallback(() => {
		setStartDate('');
		setEndDate('');
		setSelectedTickets([]);
		setPlaces([]);
		setRoutes([]);
		setChecklist([]);
		setNotes('');
		setIsAddingChecklistItem(false);
	}, [
		setStartDate,
		setEndDate,
		setSelectedTickets,
		setPlaces,
		setRoutes,
		setChecklist,
		setNotes,
	]);

	// Обработчики событий
	const openPicker = (type: 'start' | 'end') => {
		setEditingDateType(type);
		setPickerVisible(true);
	};

	const handleDateSelect = (date: string | null) => {
		if (editingDateType === 'start') {
			setStartDate(date ?? '');
		} else {
			setEndDate(date ?? '');
		}
	};

	const onSave = useCallback(async () => {
		if (!canSave) return;
		try {
			setSubmitting(true);
			await tripApi.createTrip({
				startDate,
				endDate,
				ticketIds: selectedTickets.map(ticket => ticket.id),
				places: places.filter(Boolean),
				routes: routes.filter(Boolean),
				checklist: checklist.filter(i => i.text.trim()),
				notes: notes.trim() || undefined,
				title: undefined,
			});
			resetForm();
			router.back();
		} catch (error) {
			console.error('Failed to create trip:', error);
		} finally {
			setSubmitting(false);
		}
	}, [
		canSave,
		startDate,
		endDate,
		places,
		selectedTickets,
		routes,
		checklist,
		notes,
		setSubmitting,
		resetForm,
		router,
	]);

	const onDelete = useCallback(() => {
		resetForm();
		router.back();
	}, [resetForm, router]);

	const handleAddChecklistItem = (text: string) => {
		const newItem: TripChecklistItem = {
			id: `checklist_${Date.now()}`,
			text,
			done: false,
		};
		setChecklist(prev => [...prev, newItem]);
		setIsAddingChecklistItem(false);
	};

	const handleDeleteChecklistItem = (idToDelete: string) => {
		setChecklist(prev => prev.filter(item => item.id !== idToDelete));
	};

	const formatDateForDisplay = (dateString: string | null) => {
		if (!dateString) return 'ДД.ММ.ГГГГ';
		return new Date(dateString).toLocaleDateString('ru-RU');
	};

	// Возвращаем все, что нужно для UI
	return {
		// Состояние
		startDate,
		endDate,
		selectedTickets,
		checklist,
		isAddingChecklistItem,
		isPickerVisible,
		editingDateType,
		canSave,

		// Обработчики
		openPicker,
		setPickerVisible,
		handleDateSelect,
		onSave,
		onDelete,
		setIsAddingChecklistItem,
		handleAddChecklistItem,
		handleDeleteChecklistItem,
		formatDateForDisplay,
	};
};
