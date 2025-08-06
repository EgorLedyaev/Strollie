import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';

interface ProfileMenuOverlayProps {
	visible: boolean;
	onClose: () => void;
	onEditProfile: () => void;
	onSettings: () => void;
	onHelp: () => void;
	onLogout: () => void;
}

export const ProfileMenuOverlay: React.FC<ProfileMenuOverlayProps> = ({
	visible,
	onClose,
	onEditProfile,
	onSettings,
	onHelp,
	onLogout,
}) => {
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
					style={styles.menuContainer}
					onStartShouldSetResponder={() => true}
				>
					<IconButton
						style={styles.menuItem}
						onPress={onEditProfile}
						feedback='opacity'
					>
						<AppText style={styles.menuText}>
							Редактировать профиль
						</AppText>
					</IconButton>
					<IconButton
						style={styles.menuItem}
						onPress={onSettings}
						feedback='opacity'
					>
						<AppText style={styles.menuText}>Настройки</AppText>
					</IconButton>
					<IconButton
						style={styles.menuItem}
						onPress={onHelp}
						feedback='opacity'
					>
						<AppText style={styles.menuText}>Помощь</AppText>
					</IconButton>
					<View>
						<View style={styles.divider} />
						<IconButton
							style={styles.menuItem}
							onPress={() => {
								// Закрываем меню перед выходом
								onClose();
								// Делаем небольшую паузу перед выходом
								setTimeout(() => {
									// Выполняем выход из аккаунта
									onLogout();
								}, 300);
							}}
							feedback='opacity'
						>
							<AppText
								style={[styles.menuText, styles.logoutText]}
							>
								Выйти из аккаунта
							</AppText>
						</IconButton>
					</View>
				</View>
			</IconButton>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: Colors.shadowButton,
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
		paddingTop: 80,
		paddingRight: 32,
	},
	menuContainer: {
		width: 246,
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		padding: 20,
		paddingLeft: 25,
		boxShadow: Shadows.boxShadow,
		gap: 20,
	},
	menuItem: {
		alignItems: 'flex-start',
	},
	menuText: {
		fontSize: Fonts.f14,
		color: Colors.black,
	},

	logoutText: {
		color: Colors.red,
		fontFamily: Fonts.medium,
	},
	divider: {
		borderTopWidth: 1,
		borderTopColor: Colors.gray,
		marginBottom: 10
	},
});
