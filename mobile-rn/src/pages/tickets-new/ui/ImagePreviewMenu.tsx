import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';

interface ImagePreviewMenuProps {
	visible: boolean;
	onClose: () => void;
	onEdit: () => void;
	onDelete: () => void;
	anchor?: { x: number; y: number; width: number; height: number };
}

export const ImagePreviewMenu: React.FC<ImagePreviewMenuProps> = ({
	visible,
	onClose,
	onEdit,
	onDelete,
	anchor,
}) => {
	const menuPosition = anchor
		? {
				position: 'absolute' as const,
				top: anchor.y,
				left: anchor.x + 5,
			}
		: undefined;

	return (
		<Modal
			visible={visible}
			transparent
			animationType='fade'
			onRequestClose={onClose}
		>
			<IconButton
				style={styles.overlay}
				onPress={onClose}
				feedback='opacity'
				opacity={1}
			>
				<View
					style={[styles.menuContainer, menuPosition]}
					onStartShouldSetResponder={() => true}
				>
					<IconButton onPress={onEdit} feedback='opacity'>
						<AppText style={styles.menuText}>Изменить</AppText>
					</IconButton>
					<IconButton onPress={onDelete} feedback='opacity'>
						<AppText style={[styles.menuText, styles.deleteText]}>
							Удалить
						</AppText>
					</IconButton>
				</View>
			</IconButton>
		</Modal>
	);
};

const styles = StyleSheet.create({
	deleteText: {
		color: Colors.red,
		fontFamily: Fonts.medium,
	},
	menuContainer: {
		alignItems: 'flex-start',
		backgroundColor: Colors.lightBackground,
		borderRadius: Radius.r16,
		boxShadow: Shadows.boxShadow,
		gap: 20,
		paddingHorizontal: 25,
		paddingVertical: 20,
	},
	menuText: {
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		textAlign: 'left',
	},
	overlay: {
		// backgroundColor: Colors.optionHighlight,
		flex: 1,
	},
});
