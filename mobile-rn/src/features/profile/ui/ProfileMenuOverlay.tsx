import { Colors, Fonts, Radius } from '@/src/shared/tokens';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
			<TouchableOpacity
				style={styles.overlay}
				activeOpacity={1}
				onPress={onClose}
			>
				<View
					style={styles.menuContainer}
					onStartShouldSetResponder={() => true}
				>
					<TouchableOpacity
						style={styles.menuItem}
						onPress={onEditProfile}
						activeOpacity={0.7}
					>
						<Text style={styles.menuText}>
							Редактировать профиль
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.menuItem}
						onPress={onSettings}
						activeOpacity={0.7}
					>
						<Text style={styles.menuText}>Настройки</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.menuItem}
						onPress={onHelp}
						activeOpacity={0.7}
					>
						<Text style={styles.menuText}>Помощь</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.menuItem, styles.logoutItem]}
						onPress={() => {
							// Закрываем меню перед выходом
							onClose();
							// Делаем небольшую паузу перед выходом
							setTimeout(() => {
								// Выполняем выход из аккаунта
								onLogout();
							}, 300);
						}}
						activeOpacity={0.7}
					>
						<Text style={[styles.menuText, styles.logoutText]}>
							Выйти из аккаунта
						</Text>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
		paddingTop: 80,
		paddingRight: 20,
	},
	menuContainer: {
		width: 246,
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		padding: 20,
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	menuItem: {
		paddingVertical: 14, // Увеличиваем вертикальный отступ
		paddingHorizontal: 10, // Добавляем горизонтальный отступ
	},
	menuText: {
		fontFamily: Fonts.regular,
		fontSize: 14,
		color: Colors.black,
	},
	logoutItem: {
		marginTop: 10,
		borderTopWidth: 1,
		borderTopColor: '#f0f0f0',
		paddingTop: 20,
	},
	logoutText: {
		color: '#E53935', // Красный цвет для кнопки выхода
		fontFamily: Fonts.medium,
	},
});
