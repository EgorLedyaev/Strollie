import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { TripChecklistItem, useCreateTripMutation } from '@/entities/trip';
import { formatDate } from '@/shared/lib/date';

import { tripCreateSchema, TripCreateSchema } from './schema';
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
	const createTripMutation = useCreateTripMutation();

	// Локальное UI состояние
	const [isPickerVisible, setPickerVisible] = useState(false);
	const [editingDateType, setEditingDateType] = useState<'start' | 'end'>(
		'start',
	);
	const [isAddingChecklistItem, setIsAddingChecklistItem] = useState(false);

	// Глобальное состояние (Jotai)
	const [startDateAtomVal, setStartDateAtom] = useAtom(startDateAtom);
	const [endDateAtomVal, setEndDateAtom] = useAtom(endDateAtom);
	const [selectedTicketsAtomVal, setSelectedTicketsAtom] =
		useAtom(selectedTicketsAtom);
	const [placesAtomVal, setPlacesAtom] = useAtom(placesAtom);
	const [routesAtomVal, setRoutesAtom] = useAtom(routesAtom);
	const [checklistAtomVal, setChecklistAtom] = useAtom(checklistAtom);
	const [notesAtomVal, setNotesAtom] = useAtom(notesAtom);
	const [isSubmitting, setSubmitting] = useAtom(isSubmittingAtom);

	// Инициализация формы
	const form = useForm<TripCreateSchema>({
		resolver: zodResolver(tripCreateSchema),
		defaultValues: {
			startDate: startDateAtomVal,
			endDate: endDateAtomVal,
			selectedTickets: selectedTicketsAtomVal,
			places: placesAtomVal,
			routes: routesAtomVal,
			checklist: checklistAtomVal,
			notes: notesAtomVal,
		},
		mode: 'onChange',
	});

	const {
		control,
		handleSubmit,
		setValue,
		watch,
		formState: { isValid },
	} = form;
	const formValues = watch();

	// Синхронизация атомов с формой (для полей, изменяемых извне)
	useEffect(() => {
		if (
			JSON.stringify(selectedTicketsAtomVal) !==
			JSON.stringify(formValues.selectedTickets)
		) {
			setValue('selectedTickets', selectedTicketsAtomVal);
		}
	}, [selectedTicketsAtomVal, setValue, formValues.selectedTickets]);

	useEffect(() => {
		if (
			JSON.stringify(placesAtomVal) !== JSON.stringify(formValues.places)
		) {
			setValue('places', placesAtomVal);
		}
	}, [placesAtomVal, setValue, formValues.places]);

	useEffect(() => {
		if (
			JSON.stringify(routesAtomVal) !== JSON.stringify(formValues.routes)
		) {
			setValue('routes', routesAtomVal);
		}
	}, [routesAtomVal, setValue, formValues.routes]);

	// Синхронизация формы с атомами (для сохранения состояния при навигации)
	useEffect(() => {
		setStartDateAtom(formValues.startDate);
	}, [formValues.startDate, setStartDateAtom]);

	useEffect(() => {
		setEndDateAtom(formValues.endDate);
	}, [formValues.endDate, setEndDateAtom]);

	useEffect(() => {
		setNotesAtom(formValues.notes || '');
	}, [formValues.notes, setNotesAtom]);

	useEffect(() => {
		setChecklistAtom(formValues.checklist || []);
	}, [formValues.checklist, setChecklistAtom]);

	const resetForm = useCallback(() => {
		setStartDateAtom('');
		setEndDateAtom('');
		setSelectedTicketsAtom([]);
		setPlacesAtom([]);
		setRoutesAtom([]);
		setChecklistAtom([]);
		setNotesAtom('');
		setIsAddingChecklistItem(false);
		form.reset();
	}, [
		setStartDateAtom,
		setEndDateAtom,
		setSelectedTicketsAtom,
		setPlacesAtom,
		setRoutesAtom,
		setChecklistAtom,
		setNotesAtom,
		form,
	]);

	// Обработчики событий
	const openPicker = (type: 'start' | 'end') => {
		setEditingDateType(type);
		setPickerVisible(true);
	};

	const handleDateSelect = (date: string | null) => {
		const dateStr = date ?? '';
		if (editingDateType === 'start') {
			setValue('startDate', dateStr, { shouldValidate: true });
		} else {
			setValue('endDate', dateStr, { shouldValidate: true });
		}
	};

	const handleToggleChecklistItem = (idToToggle: string) => {
		const currentChecklist = formValues.checklist || [];
		const updated = currentChecklist.map(item =>
			item.id === idToToggle ? { ...item, done: !item.done } : item,
		);
		setValue('checklist', updated);
	};

	const onSubmit = (data: TripCreateSchema) => {
		setSubmitting(true);
		createTripMutation.mutate(
			{
				startDate: data.startDate,
				endDate: data.endDate,
				ticketIds: (data.selectedTickets || []).map(
					(ticket: { id: string }) => ticket.id,
				),
				places: (data.places || []).filter(Boolean),
				routes: (data.routes || []).filter(Boolean),
				checklist: (data.checklist || []).filter(i => i.text.trim()),
				notes: (data.notes || '').trim() || undefined,
				title: undefined,
			},
			{
				onSuccess: () => {
					resetForm();
					router.back();
				},
				onError: error => {
					console.error('Failed to create trip:', error);
				},
				onSettled: () => {
					setSubmitting(false);
				},
			},
		);
	};

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
		const currentChecklist = formValues.checklist || [];
		setValue('checklist', [...currentChecklist, newItem]);
		setIsAddingChecklistItem(false);
	};

	const handleDeleteChecklistItem = (idToDelete: string) => {
		const currentChecklist = formValues.checklist || [];
		setValue(
			'checklist',
			currentChecklist.filter(item => item.id !== idToDelete),
		);
	};

	const formatDateForDisplay = (dateString: string | null | undefined) => {
		if (!dateString) return 'ДД.ММ.ГГГГ';
		return formatDate(dateString);
	};

	return {
		control,
		handleSubmit: handleSubmit(onSubmit),
		isValid,
		formValues,

		isAddingChecklistItem,
		isPickerVisible,
		editingDateType,
		isSubmitting,

		openPicker,
		setPickerVisible,
		handleDateSelect,
		onDelete,
		setIsAddingChecklistItem,
		handleAddChecklistItem,
		handleDeleteChecklistItem,
		handleToggleChecklistItem,
		formatDateForDisplay,
		setValue,
	};
};
