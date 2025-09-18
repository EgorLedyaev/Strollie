import ActionIcon from '@/assets/icons/action';
import ArrowLeftSmallIcon from '@/assets/icons/arrow/ArrowLeftSmallIcon';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { User } from '@/entities/user';
import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';

import { ProfileInfo } from './ProfileInfo';

interface HeaderProps {
	user: User;
	onBackPress: () => void;
	// Передаем координаты якоря кнопки для позиционирования меню
	onMenuPress: (anchor: {
		x: number;
		y: number;
		width: number;
		height: number;
	}) => void;
}

const HIT_SLOP = { top: 15, bottom: 15, left: 15, right: 15 };
export function ProfileHeader({ user, onBackPress, onMenuPress }: HeaderProps) {
	const menuBtnRef = useRef<View>(null);

	const handleMenuPress = () => {
		// Измеряем положение кнопки в координатах окна
		menuBtnRef.current?.measureInWindow?.((x, y, width, height) => {
			onMenuPress({ x, y, width, height });
		});
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<IconButton
					onPress={onBackPress}
					hitSlop={HIT_SLOP}
					feedback='opacity'
				>
					<ArrowLeftSmallIcon />
				</IconButton>
				<AppText style={styles.text}>@{user?.nickname}</AppText>
				{/* Оборачиваем кнопку меню во View с ref, чтобы измерить её позицию */}
				<View ref={menuBtnRef} collapsable={false}>
					<IconButton
						onPress={handleMenuPress}
						hitSlop={HIT_SLOP}
						feedback='opacity'
					>
						<ActionIcon />
					</IconButton>
				</View>
			</View>
			<ProfileInfo user={user} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r20,
		boxShadow: Shadows.boxShadow_elev1,
		height: 160,
		justifyContent: 'space-between',
		marginBottom: 20,
		padding: 16,
	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	text: {
		color: Colors.darkGray,
		fontFamily: Fonts.semibold,
	},
});
