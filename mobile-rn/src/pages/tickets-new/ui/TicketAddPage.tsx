import FileIcon from '@/assets/icons/FileIcon';
import CameraIcon from '@/assets/icons/tickets/CameraIcon';
import UploadTicketIcon from '@/assets/icons/tickets/UploadTicketIcon';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { formatISO, isBefore, startOfToday } from 'date-fns';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/widgets/header';
import { takePhoto } from '@/features/profile';
import {
	newTicketCategoryAtom,
	newTicketDateAtom,
	newTicketImageAtom,
	newTicketImageFileNameAtom,
	newTicketTitleAtom,
	resetNewTicketFormAtom,
	useAddTicketMutation,
	type Ticket,
} from '@/entities/ticket';
import { bindLogger } from '@/shared/lib/logger';
import { useAnchorMeasurement } from '@/shared/lib/useAnchorMeasurement';
import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppButton, AppText, AppTextInput, DateInput } from '@/shared/ui';
import { ActionButton } from '@/shared/ui/ActionButton';

import { FilePickerSheet, FilePickerSheetRef } from './FilePickerSheet';
import { ImagePreviewMenu } from './ImagePreviewMenu';

export const TicketAddPage: React.FC = () => {
	const router = useRouter();
	const [title, setTitle] = useAtom(newTicketTitleAtom);
	const [date, setDate] = useAtom(newTicketDateAtom);
	const [image, setImage] = useAtom(newTicketImageAtom);
	const [imageFileName, setImageFileName] = useAtom(
		newTicketImageFileNameAtom,
	);
	const [category, setCategory] = useAtom(newTicketCategoryAtom);
	const addTicketMutation = useAddTicketMutation();
	const [, resetForm] = useAtom(resetNewTicketFormAtom);
	const [saving, setSaving] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const log = React.useMemo(() => bindLogger('ticket_add'), []);

	const [isMenuVisible, setMenuVisible] = useState(false);
	// Используем единый хук измерения
	const {
		ref: moreButtonAnchorRef,
		measure: measureMoreBtn,
		anchor: moreBtnAnchor,
	} = useAnchorMeasurement();
	const bottomSheetRef = useRef<FilePickerSheetRef>(null);

	React.useEffect(() => {
		log.info('mount');
	}, [log]);

	const pickImage = async (onSuccess?: () => void) => {
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
				onSuccess?.();
			}
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : 'unknown';
			log.error('image:pick_error', { message: msg });
		}
	};

	const pickDocument = async (onSuccess?: () => void) => {
		try {
			const res = await DocumentPicker.getDocumentAsync({
				type: '*/*',
			});

			if (!res.canceled) {
				const asset = res.assets[0];
				setImage(asset.uri);
				setImageFileName(asset.name);
				log.info('document:selected', {
					uri: !!asset.uri,
					name: asset.name,
				});
				onSuccess?.();
			}
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : 'unknown';
			log.error('document:pick_error', { message: msg });
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
			// Не позволяем сохранять билеты в прошлом — иначе пользователь
			// сразу не увидит билет в текущем списке (фильтр по today/future)
			const start = startOfToday();
			if (isBefore(constructed, start)) {
				setError('Дата в прошлом');
				return;
			}
			iso = formatISO(constructed);
			setSaving(true);
			log.info('save:start', { hasImage: !!image, category });
			const ticketPayload: Omit<Ticket, 'id'> = {
				from: title,
				to: title,
				departureTime: iso,
				arrivalTime: iso,
				isUsed: false,
				type: category === 'transport' ? 'train' : 'other',
				businessCategory: category,
				title: title,
				imageUri: image ?? undefined,
				fileName: imageFileName ?? undefined,
			};
			const ticket = await addTicketMutation.mutateAsync(ticketPayload);
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

	const handleScanPress = async () => {
		const photoUri = await takePhoto();

		if (photoUri) {
			setImage(photoUri);
			setImageFileName(photoUri.split('/').pop() ?? 'camera-photo.jpg');
		} else {
			console.log('Съемка фото отменена или нет разрешений.');
		}
	};

	const openMenu = () => {
		measureMoreBtn().then(rect => {
			if (rect) setMenuVisible(true);
		});
	};

	const closeMenu = () => setMenuVisible(false);

	const handleEditImage = () => {
		closeMenu();
		bottomSheetRef.current?.present();
	};

	const handleDeleteImage = () => {
		closeMenu();
		setImage(null);
		setImageFileName(null);
	};

	const isImageFile = (fileName: string | null): boolean => {
		if (!fileName) {
			return false;
		}
		const lowercasedName = fileName.toLowerCase();
		return (
			lowercasedName.endsWith('.jpg') ||
			lowercasedName.endsWith('.jpeg') ||
			lowercasedName.endsWith('.png') ||
			lowercasedName.endsWith('.gif') ||
			lowercasedName.endsWith('.webp')
		);
	};

	return (
		<GestureHandlerRootView style={styles.container}>
			<BottomSheetModalProvider>
				<SafeAreaView style={styles.root}>
					<Header title='Мои билеты' />

					<View style={styles.content}>
						<View style={styles.formCard}>
							{error ? (
								<AppText style={styles.errorText}>
									{error}
								</AppText>
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
												prev =>
													prev ?? 'Некорректная дата',
											);
										} else if (
											error === 'Некорректная дата'
										) {
											setError(null);
										}
									}}
								/>
							</View>
							{!image && (
								<View style={styles.actionsRow}>
									<Pressable
										style={styles.actionButton}
										onPress={() =>
											bottomSheetRef.current?.present()
										}
									>
										<AppText
											style={styles.actionButtonText}
										>
											{'Выбрать файл'}
										</AppText>
										<UploadTicketIcon />
									</Pressable>
									<Pressable
										style={styles.actionButton}
										onPress={handleScanPress}
									>
										<AppText
											style={styles.actionButtonText}
										>
											Камера
										</AppText>
										<CameraIcon />
									</Pressable>
								</View>
							)}

							{image ? (
								<View style={styles.previewCard}>
									{isImageFile(imageFileName) ? (
										<Image
											source={{ uri: image }}
											style={styles.previewImage}
										/>
									) : (
										<View
											style={styles.previewIconContainer}
										>
											<FileIcon size={32} />
										</View>
									)}
									<View style={styles.fileNameContainer}>
										<AppText
											style={styles.fileName}
											numberOfLines={1}
										>
											{imageFileName}
										</AppText>
									</View>

									<View
										ref={moreButtonAnchorRef}
										collapsable={false}
									>
										<ActionButton
											onPress={openMenu}
											variant='vertical'
										/>
									</View>
								</View>
							) : null}

							<View style={styles.categoryBlock}>
								<AppText style={styles.label}>
									Категория билета
								</AppText>
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
					<ImagePreviewMenu
						visible={isMenuVisible}
						anchor={moreBtnAnchor ?? undefined}
						onClose={closeMenu}
						onEdit={handleEditImage}
						onDelete={handleDeleteImage}
					/>
					<FilePickerSheet
						ref={bottomSheetRef}
						onPickImage={pickImage}
						onPickDocument={pickDocument}
					/>
				</SafeAreaView>
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
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
	container: { flex: 1 },
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
		maxWidth: 140,
		paddingVertical: 16,
	},
	fileNameContainer: {
		flex: 1,
		marginLeft: 12,
	},
	formCard: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		gap: 24,
		marginTop: 28,
		paddingHorizontal: 16,
		paddingVertical: 32,
	},
	// previewBox: { gap: 8, maxWidth: 140 },
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

	previewCard: {
		alignItems: 'flex-start',
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r16,
		flexDirection: 'row',
		paddingHorizontal: 20,
		paddingVertical: 16,
		width: 270,
	},
	previewIconContainer: {
		alignItems: 'center',
		backgroundColor: Colors.lightBackground,
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r10,
		borderWidth: 1,
		height: 96,
		justifyContent: 'center',
		width: 96,
	},
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
