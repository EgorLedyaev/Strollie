import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';
import { Divider } from '@/shared/ui/Divider';

interface ProfileMenuOverlayProps {
	visible: boolean;
	onClose: () => void;
	onEditProfile: () => void;
	onSettings: () => void;
	onHelp: () => void;
	onLogout: () => void;
	// Новые пропсы для позиционирования
	anchor?: { x: number; y: number; width: number; height: number };
	offset?: { dx?: number; dy?: number };
}

export const ProfileMenuOverlay: React.FC<ProfileMenuOverlayProps> = ({
	visible,
	onClose,
	onEditProfile,
	onSettings,
	onHelp,
	onLogout,
	anchor,
	offset,
}) => {
	const insets = useSafeAreaInsets();

	// Базовый сдвиг: немного вниз и влево от правого края кнопки
	const dx = offset?.dx ?? 8; // влево на 8
	const dy = offset?.dy ?? 6; // вниз на 6

	const menuPosition = anchor
		? {
				position: 'absolute' as const,
				top: anchor.y + anchor.height + dy, // сразу под кнопкой с небольшим сдвигом вниз
				left: Math.max(16, anchor.x + anchor.width - dx - 246), // прижимаем правый край меню к кнопке и не даем выйти за левую границу
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
				style={[styles.overlay, { paddingTop: insets.top }]}
				onPress={onClose}
				feedback='opacity'
				opacity={1}
			>
				<View
					style={[styles.menuContainer, menuPosition]}
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
						<Divider style={styles.divider} />
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
	divider: {
		marginBottom: 10,
	},
	logoutText: {
		color: Colors.red,
		fontFamily: Fonts.medium,
	},
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
		alignItems: 'stretch',
		backgroundColor: Colors.shadowButton,
		flex: 1,
		justifyContent: 'flex-start',
		paddingHorizontal: 16,
	},
});
