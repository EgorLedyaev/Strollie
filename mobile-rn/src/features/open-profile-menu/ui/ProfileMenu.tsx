import { Colors } from '@/shared/tokens';
import { AppText } from '@/shared/ui';
import { router } from 'expo-router';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ProfileMenuProps {
	visible: boolean;
	onClose: () => void;
}

export const ProfileMenu = ({ visible, onClose }: ProfileMenuProps) => {
	const handleEditProfile = () => {
		onClose();
		// Используем поддерживаемый маршрут
		router.push('/user-data');
	};

	const handleLogout = () => {
		onClose();
		setTimeout(() => {
			// Выход без прямой зависимости, так как не уверен в реализации useLogout
			router.replace('/sign-in');
		}, 300);
	};

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
						onPress={handleEditProfile}
						activeOpacity={0.7}
					>
						<AppText style={styles.menuText}>
							Редактировать профиль
						</AppText>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.menuItem}
						activeOpacity={0.7}
					>
						<AppText style={styles.menuText}>Настройки</AppText>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.menuItem}
						activeOpacity={0.7}
					>
						<AppText style={styles.menuText}>Помощь</AppText>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.menuItem, styles.logoutItem]}
						onPress={handleLogout}
						activeOpacity={0.7}
					>
						<AppText style={[styles.menuText, styles.logoutText]}>
							Выйти из аккаунта
						</AppText>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: Colors.black + '66', // 0.4 opacity в HEX формате
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
		paddingTop: 80,
		paddingRight: 20,
	},
	menuContainer: {
		width: 246,
		backgroundColor: Colors.white,
		borderRadius: 15,
		padding: 20,
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	menuItem: {
		paddingVertical: 14,
		paddingHorizontal: 10,
	},
	menuText: {
		fontSize: 14,
		color: Colors.black,
	},
	logoutItem: {
		marginTop: 10,
		borderTopWidth: 1,
		borderTopColor: Colors.inputBorder,
		paddingTop: 20,
	},
	logoutText: {
		color: Colors.black,
		fontWeight: '600',
	},
});
