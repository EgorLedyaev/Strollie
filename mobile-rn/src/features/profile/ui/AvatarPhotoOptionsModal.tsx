import React from 'react';
import { StyleSheet, View } from 'react-native';
import Popover, { PopoverPlacement, Rect } from 'react-native-popover-view';

import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';

interface AvatarPhotoOptionsModalProps {
	visible: boolean;
	onClose: () => void;
	onPickFromDevice: () => void;
	onTakePhoto: () => void;
	onRemove: () => void;
	anchor?: { x: number; y: number; width: number; height: number };
}

export const AvatarPhotoOptionsModal: React.FC<
	AvatarPhotoOptionsModalProps
> = ({ visible, onClose, onPickFromDevice, onTakePhoto, onRemove, anchor }) => {
	const fromRect = anchor
		? new Rect(
				anchor.x,
				anchor.y + anchor.height / 2,
				anchor.width,
				anchor.height,
			)
		: undefined;

	return (
		<Popover
			isVisible={visible}
			onRequestClose={onClose}
			from={fromRect}
			placement={PopoverPlacement.BOTTOM}
			arrowSize={{ width: 0, height: 0 }}
			backgroundStyle={styles.overlay}
			popoverStyle={styles.menu}
		>
			<View testID='avatar-photo-menu' style={styles.contentWrapper}>
				<IconButton
					style={styles.item}
					onPress={onPickFromDevice}
					feedback='opacity'
				>
					<AppText style={styles.text}>С устройства</AppText>
				</IconButton>
				<IconButton
					style={styles.item}
					onPress={onTakePhoto}
					feedback='opacity'
				>
					<AppText style={styles.text}>Сделать фото</AppText>
				</IconButton>
				<IconButton
					style={styles.item}
					onPress={onRemove}
					feedback='opacity'
				>
					<AppText style={[styles.text, styles.delete]}>
						Удалить
					</AppText>
				</IconButton>
			</View>
		</Popover>
	);
};

const styles = StyleSheet.create({
	contentWrapper: {
		gap: 20,
	},
	delete: {
		color: Colors.error,
	},
	item: {
		alignItems: 'flex-start',
	},
	menu: {
		backgroundColor: Colors.lightBackground,
		borderRadius: Radius.r16,
		boxShadow: Shadows.boxShadow_elev1,
		gap: 20,
		paddingHorizontal: 25,
		paddingVertical: 20,
	},
	overlay: {
		backgroundColor: Colors.shadowButton,
	},
	text: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f14,
	},
});
