import React from 'react';
import { StyleSheet, View } from 'react-native';
import Popover, { PopoverPlacement, Rect } from 'react-native-popover-view';

import type { AnchorRect } from '@/shared/lib/useAnchorMeasurement';
import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';

interface ImagePreviewMenuProps {
	visible: boolean;
	onClose: () => void;
	onEdit: () => void;
	onDelete: () => void;
	anchor?: AnchorRect;
}

export const ImagePreviewMenu: React.FC<ImagePreviewMenuProps> = ({
	visible,
	onClose,
	onEdit,
	onDelete,
	anchor,
}) => {
	// Преобразуем наш anchor в Rect, который понимает Popover
	const fromRect = anchor
		? new Rect(anchor.x - 10, anchor.y + 70, anchor.width, anchor.height)
		: undefined;

	return (
		<Popover
			isVisible={visible}
			onRequestClose={onClose}
			from={fromRect}
			placement={PopoverPlacement.RIGHT} // базовое положение – справа
			arrowSize={{ width: 0, height: 0 }} // скрываем стрелку – чистое меню
			backgroundStyle={styles.background} // прозрачный фон, чтобы выглядело как прежнее меню
			popoverStyle={styles.menuContainer}
		>
			<View style={styles.menuContent} testID='image-preview-menu'>
				<IconButton onPress={onEdit} feedback='opacity'>
					<AppText style={styles.menuText}>Изменить</AppText>
				</IconButton>
				<IconButton onPress={onDelete} feedback='opacity'>
					<AppText style={[styles.menuText, styles.deleteText]}>
						Удалить
					</AppText>
				</IconButton>
			</View>
		</Popover>
	);
};

const styles = StyleSheet.create({
	background: {
		// полупрозрачный/прозрачный фон: используем предоставленный токен или прозрачный цвет
		backgroundColor: Colors.transparent ?? 'transparent',
	},
	deleteText: {
		color: Colors.red,
		fontFamily: Fonts.medium,
	},
	menuContainer: {
		backgroundColor: Colors.lightBackground,
		borderRadius: Radius.r16,
		boxShadow: Shadows.boxShadow,
		paddingHorizontal: 25,
		paddingVertical: 20,
	},
	menuContent: {
		alignItems: 'flex-start',
		gap: 20,
	},
	menuText: {
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		textAlign: 'left',
	},
});
