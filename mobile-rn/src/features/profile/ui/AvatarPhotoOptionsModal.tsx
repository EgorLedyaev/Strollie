import React from 'react';
import { StyleSheet, View } from 'react-native';
import Popover, { PopoverPlacement, Rect } from 'react-native-popover-view';

import type { AnchorRect } from '@/shared/lib/useAnchorMeasurement';
import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { ActionTouchable, AppText } from '@/shared/ui';

interface AvatarPhotoOptionsModalProps {
	visible: boolean;
	onClose: () => void;
	onPickFromDevice: () => void;
	onTakePhoto: () => void;
	onRemove: () => void;
	anchor?: AnchorRect;
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
				<ActionTouchable
					style={styles.item}
					onPress={onPickFromDevice}
					feedback='opacity'
				>
					<AppText style={styles.text}>С устройства</AppText>
				</ActionTouchable>
				<ActionTouchable
					style={styles.item}
					onPress={onTakePhoto}
					feedback='opacity'
				>
					<AppText style={styles.text}>Сделать фото</AppText>
				</ActionTouchable>
				<ActionTouchable
					style={styles.item}
					onPress={onRemove}
					feedback='opacity'
				>
					<AppText style={[styles.text, styles.delete]}>
						Удалить
					</AppText>
				</ActionTouchable>
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
