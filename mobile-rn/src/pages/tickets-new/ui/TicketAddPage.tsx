import ScanTicket from '@/assets/icons/tickets/ScanTicket';
import UploadTicket from '@/assets/icons/tickets/UploadTicket';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ticketApi, ticketsAtom } from '@/entities/ticket';
import {
	newTicketCategoryAtom,
	newTicketDateAtom,
	newTicketImageAtom,
	newTicketImageFileNameAtom,
	newTicketTitleAtom,
	resetNewTicketFormAtom,
} from '@/entities/ticket/model/ticket.add-form.state';
import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppButton, AppText, AppTextInput, BackButton } from '@/shared/ui';

export const TicketAddPage: React.FC = () => {
	const router = useRouter();
	const [title, setTitle] = useAtom(newTicketTitleAtom);
	const [date, setDate] = useAtom(newTicketDateAtom);
	const [image, setImage] = useAtom(newTicketImageAtom);
	const [imageFileName, setImageFileName] = useAtom(
		newTicketImageFileNameAtom,
	);
	const [category, setCategory] = useAtom(newTicketCategoryAtom);
	const [, setTickets] = useAtom(ticketsAtom);
	const [, resetForm] = useAtom(resetNewTicketFormAtom);
	const [saving, setSaving] = React.useState(false);

	const pickImage = async () => {
		const res = await ImagePicker.launchImageLibraryAsync({
			allowsMultipleSelection: false,
			quality: 0.9,
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
		});
		if (!res.canceled) {
			const asset = res.assets[0];
			setImage(asset.uri);
			setImageFileName(
				asset.fileName ?? asset.uri.split('/').pop() ?? 'image',
			);
		}
	};

	const onSave = async () => {
		if (!title || !date || !category) return;
		setSaving(true);
		try {
			const ticket = await ticketApi.createCustomTicket({
				title,
				date: new Date(date).toISOString(),
				imageUri: image ?? undefined,
				fileName: imageFileName ?? undefined,
				businessCategory: category,
			});
			setTickets(prev => [...prev, ticket]);
			resetForm();
			router.replace('/tickets');
		} finally {
			setSaving(false);
		}
	};

	const canSave = !!title && !!date && !!category && !saving;

	return (
		<SafeAreaView style={styles.root}>
			<View style={styles.header}>
				<BackButton variant='icon' onPress={() => router.back()} />
				<AppText style={styles.headerTitle}>Мои билеты</AppText>
				<View style={styles.headerRightStub} />
			</View>

			<View style={styles.content}>
				<View style={styles.formCard}>
					<View style={styles.field}>
						<AppText style={styles.label}>Название</AppText>
						<AppTextInput
							value={title}
							placeholderTextColor={Colors.lightInputText}
							onChangeText={setTitle}
							placeholder='Введите название билета или рейса'
							style={styles.input}
						/>
					</View>
					<View style={styles.field}>
						<AppText style={styles.label}>Дата</AppText>
						<AppTextInput
							value={date}
							placeholderTextColor={Colors.lightInputText}
							onChangeText={setDate}
							placeholder='Выберите дату билета или рейса'
							style={styles.input}
						/>
					</View>
					<View style={styles.actionsRow}>
						<Pressable
							style={styles.actionButton}
							onPress={pickImage}
						>
							<AppText style={styles.actionButtonText}>
								{image ? 'Изменить файл' : 'Выбрать файл'}
							</AppText>
							<UploadTicket />
						</Pressable>
						<Pressable
							style={styles.actionButton}
							onPress={pickImage}
						>
							<AppText style={styles.actionButtonText}>
								Сканировать
							</AppText>
							<ScanTicket />
						</Pressable>
					</View>
					{image ? (
						<View style={styles.previewBox}>
							<Image
								source={{ uri: image }}
								style={styles.previewImage}
							/>
							<AppText style={styles.fileName} numberOfLines={1}>
								{imageFileName}
							</AppText>
						</View>
					) : null}

					<View style={styles.categoryBlock}>
						<AppText style={styles.label}>Категория билета</AppText>
						<Pressable
							style={styles.radioRow}
							onPress={() => setCategory('transport')}
						>
							<View style={styles.radioOuter}>
								{category === 'transport' && (
									<View style={styles.radioInner} />
								)}
							</View>
							<AppText
								style={
									category === 'transport'
										? styles.radioTextActive
										: styles.radioText
								}
							>
								Транспорт
							</AppText>
						</Pressable>
						<Pressable
							style={styles.radioRow}
							onPress={() => setCategory('entertainment')}
						>
							<View style={styles.radioOuter}>
								{category === 'entertainment' && (
									<View style={styles.radioInner} />
								)}
							</View>
							<AppText
								style={
									category === 'entertainment'
										? styles.radioTextActive
										: styles.radioText
								}
							>
								Развлечения
							</AppText>
						</Pressable>
					</View>
				</View>
			</View>

			<View style={styles.saveBtnWrap}>
				<AppButton
					text='Сохранить билет'
					onPress={onSave}
					disabled={!canSave}
					isLoading={saving}
					buttonBorderRadius={Radius.r16}
					textFontSize={Fonts.f16}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	actionButton: {
		alignItems: 'center',
		backgroundColor: Colors.uploadButtonBackground,
		borderRadius: Radius.r16,
		flex: 1,
		flexDirection: 'row',
		gap: 8,
		height: 44,
		justifyContent: 'center',
	},
	actionButtonText: {
		color: Colors.lightInputText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	actionsRow: { alignItems: 'center', flexDirection: 'row', gap: 12 },
	categoryBlock: { marginTop: 8 },
	content: {
		flex: 1,
	},
	field: {
		gap: Gaps.g8,
	},
	fileName: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		maxWidth: 120,
	},
	formCard: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		gap: 24,
		marginTop: 28,
		paddingHorizontal: 16,
		paddingVertical: 32,
	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	headerRightStub: { height: 32, width: 32 },
	headerTitle: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
	},
	// input: { borderColor: Colors.black, marginTop: 8 },
	input: {
		// --- Стили контейнера ---
		backgroundColor: Colors.white,
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r16,
		borderWidth: 1,
		color: Colors.greenPrimary,
		height: 54,
		paddingHorizontal: 16,
	},
	label: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.medium,
	},
	previewBox: { gap: 8, maxWidth: 140 },
	previewImage: {
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r10,
		borderWidth: 1,
		height: 96,
		width: 96,
	},
	radioInner: {
		backgroundColor: Colors.successGreen,
		borderRadius: Radius.r8,
		height: 10,
		width: 10,
	},
	radioOuter: {
		alignItems: 'center',
		borderColor: Colors.successGreen,
		borderRadius: Radius.r10,
		borderWidth: 1,
		height: 16,
		justifyContent: 'center',
		marginRight: 12,
		width: 16,
	},
	radioRow: {
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: 12,
		paddingHorizontal: 16,
	},
	radioText: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
	},
	radioTextActive: {
		color: Colors.successGreen,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
	},
	root: { backgroundColor: Colors.grayBackground, flex: 1, padding: 16 },
	saveBtnWrap: { height: 52, marginTop: 24 },
});

export default TicketAddPage;
