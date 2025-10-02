import ArrowLeftSmallIcon from '@/assets/icons/arrow/ArrowLeftSmallIcon';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { User } from '@/entities/user';
import {
	useAnchorMeasurement,
	type AnchorRect,
} from '@/shared/lib/useAnchorMeasurement';
import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';
import { ActionButton } from '@/shared/ui/ActionButton';

import { ProfileInfo } from './ProfileInfo';

interface HeaderProps {
	user: User;
	onBackPress: () => void;
	// Передаем координаты якоря кнопки для позиционирования меню
	onMenuPress: (anchor: AnchorRect) => void;
}

const HIT_SLOP = { top: 15, bottom: 15, left: 15, right: 15 };
export function ProfileHeader({ user, onBackPress, onMenuPress }: HeaderProps) {
	const { ref: menuAnchorRef, measure } = useAnchorMeasurement();

	const handleMenuPress = () => {
		// Унифицированное измерение через хук
		measure().then(rect => {
			if (rect) onMenuPress(rect);
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
				{/* Оборачиваем кнопку в View с ref для стабильного измерения */}
				<View ref={menuAnchorRef} collapsable={false}>
					<ActionButton onPress={handleMenuPress} />
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
