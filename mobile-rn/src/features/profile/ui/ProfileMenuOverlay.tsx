import React from 'react';
import { StyleSheet, View } from 'react-native';
import Popover, { PopoverPlacement, Rect } from 'react-native-popover-view';

import type { AnchorRect } from '@/shared/lib/useAnchorMeasurement';
import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';

interface ProfileMenuOverlayProps {
	visible: boolean;
	onClose: () => void;
	onEditProfile: () => void;
	onHelp: () => void;
	anchor?: AnchorRect;
}

export const ProfileMenuOverlay: React.FC<ProfileMenuOverlayProps> = ({
	visible,
	onClose,
	onEditProfile,
	onHelp,
	anchor,
}) => {
	const fromRect = anchor
		? new Rect(anchor.x - 140, anchor.y + 50, anchor.width, anchor.height)
		: undefined;

	return (
		<Popover
			isVisible={visible}
			onRequestClose={onClose}
			from={fromRect}
			placement={PopoverPlacement.BOTTOM}
			arrowSize={{ width: 0, height: 0 }}
			backgroundStyle={styles.overlay}
			popoverStyle={styles.menuContainer}
		>
			<View testID='profile-menu-popover' style={styles.contentWrapper}>
				<IconButton
					style={styles.menuItem}
					onPress={onEditProfile}
					feedback='opacity'
				>
					<AppText style={styles.menuText}>
						Редактировать профиль
					</AppText>
				</IconButton>
				{/*<IconButton*/}
				{/*	style={styles.menuItem}*/}
				{/*	onPress={onSettings}*/}
				{/*	feedback='opacity'*/}
				{/*>*/}
				{/*	<AppText style={styles.menuText}>Настройки</AppText>*/}
				{/*</IconButton>*/}
				<IconButton
					style={styles.menuItem}
					onPress={onHelp}
					feedback='opacity'
				>
					<AppText style={styles.menuText}>Помощь</AppText>
				</IconButton>
				{/*<View>*/}
				{/*	<Divider style={styles.divider} />*/}
				{/*	<IconButton*/}
				{/*		style={styles.menuItem}*/}
				{/*		onPress={() => {*/}
				{/*			onClose();*/}
				{/*			setTimeout(() => {*/}
				{/*				onLogout();*/}
				{/*			}, 300);*/}
				{/*		}}*/}
				{/*		feedback='opacity'*/}
				{/*	>*/}
				{/*		<AppText style={[styles.menuText, styles.logoutText]}>*/}
				{/*			Выйти из аккаунта*/}
				{/*		</AppText>*/}
				{/*	</IconButton>*/}
				{/*</View>*/}
			</View>
		</Popover>
	);
};

const styles = StyleSheet.create({
	contentWrapper: {
		gap: 20,
	},
	// divider: {
	// 	marginBottom: 10,
	// },
	// logoutText: {
	// 	color: Colors.red,
	// 	fontFamily: Fonts.medium,
	// },
	menuContainer: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		boxShadow: Shadows.boxShadow,
		gap: 20,
		padding: 20,
		paddingLeft: 25,
		width: 246,
	},
	menuItem: {
		alignItems: 'flex-start',
	},
	menuText: {
		color: Colors.black,
		fontSize: Fonts.f14,
	},
	overlay: {
		backgroundColor: Colors.shadowButton,
		paddingHorizontal: 16,
	},
});
