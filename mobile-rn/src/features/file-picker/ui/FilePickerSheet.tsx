import FileIcon from '@/assets/icons/FileIcon';
import FolderIcon from '@/assets/icons/FolderIcon';
import GalleryIcon from '@/assets/icons/GalleryIcon';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

export interface FilePickerSheetRef {
	present: () => void;
}

interface FilePickerSheetProps {
	onPickImage: (onSuccess: () => void) => void;
	onPickDocument: (onSuccess: () => void) => void;
}

// Моковые данные для недавних файлов
const recentFiles = [
	{ name: '123123trsdf_1.docx', type: 'doc' },
	{ name: 'IMG_9029.jpg', type: 'image' },
	{ name: 'IMG_475243.jpg', type: 'image' },
];

export const FilePickerSheet = forwardRef<
	FilePickerSheetRef,
	FilePickerSheetProps
>(({ onPickImage, onPickDocument }, ref) => {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => ['55%', '60%'], []);
	const closeSheet = () => {
		bottomSheetModalRef.current?.dismiss();
	};

	useImperativeHandle(ref, () => ({
		present: () => {
			bottomSheetModalRef.current?.present();
		},
	}));

	return (
		<BottomSheetModal
			ref={bottomSheetModalRef}
			index={0}
			snapPoints={snapPoints}
			handleIndicatorStyle={styles.handle}
			backgroundStyle={styles.background}
			backdropComponent={props => (
				<BottomSheetBackdrop
					{...props}
					appearsOnIndex={0}
					disappearsOnIndex={-1}
				/>
			)}
		>
			<View style={styles.content}>
				<View style={styles.actionsCard}>
					<Pressable
						style={styles.actionButton}
						onPress={() => onPickImage(closeSheet)}
					>
						<GalleryIcon />
						<AppText style={styles.actionText}>
							Выбрать из галереи
						</AppText>
					</Pressable>
					<View style={styles.divider} />
					<Pressable
						style={styles.actionButton}
						onPress={() => onPickDocument(closeSheet)}
					>
						<FolderIcon />
						<AppText style={styles.actionText}>
							Выбрать из файлов
						</AppText>
					</Pressable>
				</View>

				<AppText variant={'body'} style={styles.sectionHeader}>
					Недавно использованные
				</AppText>
				<View style={styles.recentFilesCard}>
					{recentFiles.map((file, index) => (
						<React.Fragment key={file.name}>
							<Pressable style={styles.recentItem}>
								<View style={styles.fileIconContainer}>
									<FileIcon />
								</View>
								<AppText variant={'caption'}>
									{file.name}
								</AppText>
							</Pressable>
							{index < recentFiles.length - 1 && (
								<View style={styles.divider} />
							)}
						</React.Fragment>
					))}
				</View>
			</View>
		</BottomSheetModal>
	);
});

const styles = StyleSheet.create({
	actionButton: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 12,
		padding: 16,
	},
	actionText: { color: Colors.secondaryText },
	actionsCard: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
	},
	background: {
		backgroundColor: Colors.grayBackground,
	},
	content: {
		backgroundColor: Colors.grayBackground,
		flex: 1,
		gap: 16,
		paddingHorizontal: 32,
		paddingVertical: 16,
	},
	divider: {
		backgroundColor: Colors.grayBackground,
		height: 2,
		marginHorizontal: 8,
	},
	fileIconContainer: {
		alignItems: 'center',
		backgroundColor: Colors.inputOptionBorder,
		borderRadius: Radius.r8,
		height: 48,
		justifyContent: 'center',
		width: 48,
	},
	handle: {
		backgroundColor: Colors.scrollbarThumb,
		width: 38,
	},
	recentFilesCard: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
	},
	recentItem: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 12,
		paddingHorizontal: 20,
		paddingVertical: 12,
	},
	sectionHeader: {
		fontFamily: Fonts.semibold,
		paddingLeft: 16,
		paddingTop: 16,
	},
});
