import { useAtom } from 'jotai';
import React, { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { tripApi } from '@/entities/trip';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppButton, AppText, AppTextInput } from '@/shared/ui';

import {
	checklistAtom,
	endDateAtom,
	isSubmittingAtom,
	notesAtom,
	placesAtom,
	routesAtom,
	startDateAtom,
} from '../model/state';

function SectionCard({ children }: { children: React.ReactNode }) {
	return <View style={styles.sectionCard}>{children}</View>;
}

const PlusButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
	<Pressable onPress={onPress} style={styles.plusBtn} hitSlop={8}>
		<AppText style={styles.plus}>+</AppText>
	</Pressable>
);

export const TripCreatePage: React.FC = () => {
	const [startDate, setStartDate] = useAtom(startDateAtom);
	const [endDate, setEndDate] = useAtom(endDateAtom);
	const [notes, setNotes] = useAtom(notesAtom);
	const [places, setPlaces] = useAtom(placesAtom);
	const [routes, setRoutes] = useAtom(routesAtom);
	const [checklist, setChecklist] = useAtom(checklistAtom);
	const [isSubmitting, setSubmitting] = useAtom(isSubmittingAtom);

	const addPlace = () => setPlaces(p => [...p, '']);
	const updatePlace = (i: number, v: string) =>
		setPlaces(p => p.map((x, idx) => (idx === i ? v : x)));
	const addRoute = () => setRoutes(r => [...r, '']);
	const updateRoute = (i: number, v: string) =>
		setRoutes(r => r.map((x, idx) => (idx === i ? v : x)));
	const addChecklist = () =>
		setChecklist(c => [
			...c,
			{ id: Math.random().toString(36).slice(2), text: '', done: false },
		]);
	const updateChecklist = (i: number, v: string) =>
		setChecklist(c =>
			c.map((x, idx) => (idx === i ? { ...x, text: v } : x)),
		);

	const canSave = startDate && endDate && !isSubmitting;

	const onSave = useCallback(async () => {
		if (!canSave) return;
		try {
			setSubmitting(true);
			await tripApi.createTrip({
				startDate,
				endDate,
				ticketIds: [],
				places: places.filter(Boolean),
				routes: routes.filter(Boolean),
				checklist: checklist.filter(i => i.text.trim()),
				notes: notes.trim() || undefined,
				title: undefined,
			});
			// naive reset
			setStartDate('');
			setEndDate('');
			setPlaces([]);
			setRoutes([]);
			setChecklist([]);
			setNotes('');
		} finally {
			setSubmitting(false);
		}
	}, [
		canSave,
		startDate,
		endDate,
		places,
		routes,
		checklist,
		notes,
		setSubmitting,
		setStartDate,
		setEndDate,
		setPlaces,
		setRoutes,
		setChecklist,
		setNotes,
	]);

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<SectionCard>
				<View style={styles.rowSpace}>
					<View style={styles.inlineGroup}>
						<AppText style={styles.label}>Начало</AppText>
						<AppTextInput
							placeholder='ДД.ММ.ГГГГ'
							value={startDate}
							onChangeText={setStartDate}
							style={styles.input}
						/>
					</View>
					<View style={styles.inlineGroup}>
						<AppText style={styles.label}>Конец</AppText>
						<AppTextInput
							placeholder='ДД.ММ.ГГГГ'
							value={endDate}
							onChangeText={setEndDate}
							style={styles.input}
						/>
					</View>
				</View>
			</SectionCard>

			<View style={styles.sectionHeaderRow}>
				<AppText style={styles.sectionTitle}>Места</AppText>
				<PlusButton onPress={addPlace} />
			</View>
			{places.map((p, i) => (
				<SectionCard key={`place_${i}`}>
					<AppTextInput
						placeholder={`Место #${i + 1}`}
						value={p}
						onChangeText={v => updatePlace(i, v)}
						style={styles.inputFull}
					/>
				</SectionCard>
			))}

			<View style={styles.sectionHeaderRow}>
				<AppText style={styles.sectionTitle}>Чек-лист</AppText>
				<PlusButton onPress={addChecklist} />
			</View>
			{checklist.map((c, i) => (
				<SectionCard key={c.id}>
					<AppTextInput
						placeholder={`Пункт #${i + 1}`}
						value={c.text}
						onChangeText={v => updateChecklist(i, v)}
						style={styles.inputFull}
					/>
				</SectionCard>
			))}

			<View style={styles.sectionHeaderRow}>
				<AppText style={styles.sectionTitle}>Маршруты</AppText>
				<PlusButton onPress={addRoute} />
			</View>
			{routes.map((r, i) => (
				<SectionCard key={`route_${i}`}>
					<AppTextInput
						placeholder={`Маршрут #${i + 1}`}
						value={r}
						onChangeText={v => updateRoute(i, v)}
						style={styles.inputFull}
					/>
				</SectionCard>
			))}

			<View style={styles.sectionHeaderRow}>
				<AppText style={styles.sectionTitle}>Заметки</AppText>
			</View>
			<SectionCard>
				<AppTextInput
					placeholder='Введите текст...'
					value={notes}
					onChangeText={setNotes}
					multiline
					style={[styles.inputFull, styles.notesInput]}
				/>
			</SectionCard>

			<View style={styles.actionsRow}>
				<AppButton
					text='Удалить'
					variant='outline'
					onPress={() => {
						setStartDate('');
						setEndDate('');
						setPlaces([]);
						setRoutes([]);
						setChecklist([]);
						setNotes('');
					}}
					style={styles.deleteBtn}
					textColor={Colors.red}
				/>
				<AppButton
					text='Сохранить поездку'
					onPress={onSave}
					disabled={!canSave}
					isLoading={isSubmitting}
					style={styles.saveBtn}
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	actionsRow: { flexDirection: 'row', gap: 16, marginBottom: 40 },
	container: {
		gap: 24,
		padding: 16,
	},
	deleteBtn: { flex: 1, height: 44 },
	inlineGroup: { gap: 8 },
	input: {
		backgroundColor: Colors.white,
		borderColor: Colors.inputBorder,
		borderRadius: 12,
		borderWidth: 1,
		color: Colors.headerAndInputText,
		fontSize: Fonts.f16,
		height: 44,
		paddingHorizontal: 12,
		width: 140,
	},
	inputFull: {
		backgroundColor: Colors.white,
		borderColor: Colors.inputBorder,
		borderRadius: 12,
		borderWidth: 1,
		color: Colors.headerAndInputText,
		fontSize: Fonts.f16,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	label: { color: Colors.headerAndInputText, fontSize: Fonts.f14 },
	notesInput: {
		minHeight: 100,
		textAlignVertical: 'top',
	},
	plus: { color: Colors.placeholderGray, fontSize: Fonts.f20 },
	plusBtn: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderColor: Colors.inputBorder,
		borderRadius: 8,
		borderWidth: 1,
		height: 32,
		justifyContent: 'center',
		width: 32,
	},
	rowSpace: {
		flexDirection: 'row',
		gap: 16,
		justifyContent: 'space-between',
	},
	saveBtn: { flex: 2, height: 44 },
	sectionCard: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		gap: 12,
		padding: 16,
	},
	sectionHeaderRow: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	sectionTitle: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
	},
});
