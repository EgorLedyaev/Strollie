import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmModal } from '@/pages/settings/ui/ConfirmModal';
import { Header } from '@/widgets/header';
import { Colors, Fonts, Gaps, Radius, Shadows } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

export const SettingsPage: React.FC = () => {
	const [activeModal, setActiveModal] = useState<'logout' | 'delete' | null>(
		null,
	);

	const handleLogout = () => {
		console.log('Logout pressed');
	};
	const handleDeleteProfile = () => {
		console.log('Delete Profile pressed');
	};
	const handleChangeEmail = () => {
		router.push('/settings/change-email');
	};
	const handleOpenOffer = () => console.log('Public Offer pressed');
	const handleOpenPolicy = () => console.log('Privacy Policy pressed');

	return (
		<SafeAreaView style={styles.root}>
			<Header title='Настройки' />
			<ScrollView
				style={styles.container}
				showsVerticalScrollIndicator={false}
			>
				{/*Профиль*/}
				<View style={styles.section}>
					<AppText style={styles.sectionTitle}>Профиль</AppText>
					<View style={styles.card}>
						<Pressable
							style={styles.actionItem}
							onPress={() => setActiveModal('logout')}
						>
							<AppText style={styles.actionText}>
								Выйти из профиля
							</AppText>
						</Pressable>
						<View style={styles.separator} />
						<Pressable
							style={styles.actionItem}
							onPress={() => setActiveModal('delete')}
						>
							<AppText style={styles.deleteText}>
								Удалить профиль
							</AppText>
						</Pressable>
					</View>
					<View style={styles.card}>
						<Pressable
							style={styles.actionItem}
							onPress={handleChangeEmail}
						>
							<AppText style={styles.actionText}>
								Изменить почту профиля
							</AppText>
						</Pressable>
					</View>
				</View>

				{/* Юридическая информация */}
				<View style={styles.section}>
					<AppText style={styles.sectionTitle}>
						Юр. информация
					</AppText>
					<View style={styles.card}>
						<Pressable
							style={styles.actionItem}
							onPress={handleOpenOffer}
						>
							<AppText style={styles.linkText}>
								Публичная оферта
							</AppText>
						</Pressable>
						<View style={styles.separator} />
						<Pressable
							style={styles.actionItem}
							onPress={handleOpenPolicy}
						>
							<AppText style={styles.linkText}>
								Политика конфиденциальности
							</AppText>
						</Pressable>
					</View>
				</View>

				{/* Поддержка */}
				<View style={styles.section}>
					<AppText style={styles.sectionTitle}>
						Связь с поддержкой
					</AppText>
					<View style={styles.card}>
						<View style={styles.actionItem}>
							<AppText style={styles.supportText}>
								По всем вопросам обращаться по эл. почте:{' '}
								<AppText style={styles.linkText}>
									riveo_corporative@riveo.ru
								</AppText>
							</AppText>
						</View>
					</View>
				</View>
			</ScrollView>
			<ConfirmModal
				isVisible={activeModal === 'logout'}
				title='Выйти из профиля?'
				cancelText='Отмена'
				confirmText='Выйти'
				onClose={() => setActiveModal(null)}
				onConfirm={handleLogout}
				primaryButton={'gray'}
			/>
			<ConfirmModal
				isVisible={activeModal === 'delete'}
				title='Удалить профиль?'
				cancelText='Отмена'
				confirmText='Удалить'
				onClose={() => setActiveModal(null)}
				onConfirm={handleDeleteProfile}
				primaryButton='green'
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	actionItem: {
		paddingHorizontal: 20,
		paddingVertical: 18,
	},
	actionText: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
	},
	card: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		boxShadow: Shadows.boxShadow_elev1,
	},
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 8,
	},
	deleteText: {
		color: Colors.red,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
	},
	linkText: {
		color: Colors.greenLink,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
		textDecorationLine: 'underline',
	},
	root: {
		backgroundColor: Colors.grayBackground,
		flex: 1,
		padding: 16,
	},
	section: {
		gap: Gaps.g12,
		marginBottom: 24, // Отступ между элементами в секции
	},
	sectionTitle: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
		paddingTop: 24,
	},
	separator: {
		backgroundColor: Colors.grayBackground,
		height: 1, // Тонкая линия-разделитель
		marginHorizontal: 16,
	},
	supportText: {
		color: Colors.grayText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
		lineHeight: 22, // Улучшаем читаемость для многострочного текста
	},
});

export default SettingsPage;
