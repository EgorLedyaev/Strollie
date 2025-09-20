import CameraIcon from '@/assets/icons/tickets/CameraIcon';
import UploadTicketIcon from '@/assets/icons/tickets/UploadTicketIcon';
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
import { bindLogger } from '@/shared/lib/logger';
import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import {
	AppButton,
	AppText,
	AppTextInput,
	BackButton,
	DateInput,
} from '@/shared/ui';

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
	const [error, setError] = React.useState<string | null>(null);
	const log = React.useMemo(() => bindLogger('ticket_add'), []);

	React.useEffect(() => {
		log.info('mount');
	}, [log]);

	const pickImage = async () => {
		try {
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
				log.info('image:selected', {
					uri: !!asset.uri,
					name: asset.fileName,
				});
			}
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : 'unknown';
			log.error('image:pick_error', { message: msg });
		}
	};

	const onSave = async () => {
		if (!title || !date || !category) return;
		setError(null);
		let iso: string | null = null;
		try {
			// Ожидаем формат DD.MM.YYYY
			const match = date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
			if (!match) {
				setError('Некорректная дата');
				return;
			}
			const [, ddStr, mmStr, yyyyStr] = match;
			const dd = Number(ddStr);
			const mm = Number(mmStr);
			const yyyy = Number(yyyyStr);
			// Базовые границы (можно расширить если нужно)
			if (mm < 1 || mm > 12 || dd < 1 || dd > 31 || yyyy < 1900) {
				setError('Некорректная дата');
				return;
			}
			const constructed = new Date(yyyy, mm - 1, dd);
			// Проверяем что JS дата совпала (отсекает 31.02 и т.п.)
			if (
				constructed.getFullYear() !== yyyy ||
				constructed.getMonth() !== mm - 1 ||
				constructed.getDate() !== dd
			) {
				setError('Некорректная дата');
				return;
			}
			iso = constructed.toISOString();
			setSaving(true);
			log.info('save:start', { hasImage: !!image, category });
			const ticket = await ticketApi.createCustomTicket({
				title,
				date: iso,
				imageUri: image ?? undefined,
				fileName: imageFileName ?? undefined,
				businessCategory: category,
			});
			setTickets(prev => [...prev, ticket]);
			log.info('save:success', { id: ticket.id });
			resetForm();
			router.replace('/tickets');
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : 'unknown';
			log.error('save:error', { message: msg });
			setError('Ошибка сохранения');
		} finally {
			setSaving(false);
		}
	};

	const canSave = !!title && !!date && !!category && !saving && !error;

	return (
		<SafeAreaView style={styles.root}>
			<View style={styles.header}>
				<BackButton variant='icon' onPress={() => router.back()} />
				<AppText style={styles.headerTitle}>Мои билеты</AppText>
				<View style={styles.headerRightStub} />
			</View>

			<View style={styles.content}>
				<View style={styles.formCard}>
					{error ? (
						<AppText style={styles.errorText}>{error}</AppText>
					) : null}
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
						<DateInput
							value={date}
							onChangeText={setDate}
							placeholder='Выберите дату билета или рейса'
							allowFuture={true}
							liveValidate={false}
							onValidityChange={isValid => {
								if (!isValid) {
									setError(
										prev => prev ?? 'Некорректная дата',
									);
								} else if (error === 'Некорректная дата') {
									setError(null);
								}
							}}
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
							<UploadTicketIcon />
						</Pressable>
						<Pressable
							style={styles.actionButton}
							onPress={pickImage}
						>
							<AppText style={styles.actionButtonText}>
								Камера
							</AppText>
							<CameraIcon />
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
		// flex: 1,
		flexDirection: 'row',
		gap: 8,
		height: 44,
		justifyContent: 'center',
		paddingHorizontal: 20,
		width: 'auto',
	},
	actionButtonText: {
		color: Colors.lightInputText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	actionsRow: { alignItems: 'center', flexDirection: 'row', gap: 5 },
	categoryBlock: { marginTop: 8 },
	content: {
		flex: 1,
	},
	errorText: {
		color: Colors.secondaryText,
		fontFamily: Fonts.medium,
		marginBottom: 8,
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
	input: {
		backgroundColor: Colors.white,
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r16,
		borderWidth: 1,
		color: Colors.headerAndInputText,
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
