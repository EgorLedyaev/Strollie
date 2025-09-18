import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';

interface AvatarPhotoOptionsModalProps {
	visible: boolean;
	onClose: () => void;
	onPickFromDevice: () => void;
	onTakePhoto: () => void;
	onRemove: () => void;
	anchor?: { x: number; y: number; width: number; height: number };
	offset?: { dx?: number; dy?: number };
}

export const AvatarPhotoOptionsModal: React.FC<
	AvatarPhotoOptionsModalProps
> = ({ visible, onClose, onPickFromDevice, onTakePhoto, onRemove, anchor }) => {
	const insets = useSafeAreaInsets();

	const menuStyle = anchor
		? {
				position: 'absolute' as const,
				top: anchor.y + anchor.height * 2,
				left: anchor.x,
			}
		: undefined;

	return (
		<Modal
			statusBarTranslucent
			visible={visible}
			transparent
			animationType='fade'
			onRequestClose={onClose}
		>
			<IconButton
				style={[styles.fullscreen, { paddingTop: insets.top }]}
				onPress={onClose}
				feedback='opacity'
				opacity={1}
			>
				<View style={[styles.menu, menuStyle]}>
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
			</IconButton>
		</Modal>
	);
};

const styles = StyleSheet.create({
	delete: {
		color: Colors.error,
	},
	fullscreen: {
		flex: 1,
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
	text: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f14,
	},
});
