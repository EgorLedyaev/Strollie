import CheckmarkIcon from '@/assets/icons/CheckmarkIcon';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';
import { ActionButton } from '@/shared/ui/ActionButton';

import type { Ticket } from '../model';

interface Props {
	ticket: Ticket;
	/** Показать меню действий (опционально) */
	onPressActions?: () => void;
	// Обработчик нажатия на сам билет
	onPress?: (ticketId: string) => void;
	isSelected?: boolean;
}

/**
 * Полностью независимый отображатель билета.
 * Не использует старые карточки и их стили.
 * Нет секции для QR – намеренно по требованию.
 */
export const NewTicketItem: React.FC<Props> = ({
	ticket,
	onPressActions,
	onPress,
	isSelected = false,
}) => {
	const departure = parseISO(ticket.departureTime);
	const title =
		ticket.title ||
		[ticket.from, ticket.to].filter(Boolean).join(' - ') ||
		'Билет';

	const handlePress = () => {
		if (onPress) {
			onPress(ticket.id);
		}
	};

	return (
		<Pressable
			style={styles.root}
			onPress={handlePress}
			disabled={!onPress}
		>
			<View style={styles.thumbWrap}>
				{ticket.imageUri ? (
					<Image
						source={{ uri: ticket.imageUri }}
						style={styles.thumb}
						resizeMode='cover'
					/>
				) : (
					<View style={styles.thumbPlaceholder} />
				)}
			</View>

			<View style={styles.mainCol}>
				<View style={styles.textWrap}>
					<AppText style={styles.title} numberOfLines={1}>
						{title}
					</AppText>
					<AppText style={styles.date}>
						{format(departure, 'dd.MM.yyyy', { locale: ru })}
					</AppText>
				</View>
				{ticket.businessCategory ? (
					<AppText style={styles.badgeText} numberOfLines={1}>
						{ticket.businessCategory}
					</AppText>
				) : (
					<View />
				)}
			</View>
			<ActionButton
				onPress={onPressActions ?? (() => {})}
				variant='vertical'
				style={styles.dots}
			/>
			{isSelected && (
				<View style={styles.overlay}>
					<View style={styles.checkmarkCircle}>
						<CheckmarkIcon />
					</View>
				</View>
			)}
		</Pressable>
	);
};

const THUMB = 64;

const styles = StyleSheet.create({
	badgeText: {
		color: Colors.lightInputText,
		fontSize: Fonts.f14,
	},
	checkmarkCircle: {
		alignItems: 'center',
		backgroundColor: Colors.successGreen,
		borderRadius: Radius.r100,
		height: 48,
		justifyContent: 'center',
		width: 48,
	},

	date: {
		color: Colors.headerAndInputText,
		fontSize: Fonts.f14,
	},
	dots: {
		alignSelf: 'flex-start',
		justifyContent: 'flex-end',
	},
	mainCol: {
		flex: 1,
		justifyContent: 'space-between',
		paddingVertical: 2,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Colors.selectedTicketBackground,
		justifyContent: 'center',
		paddingHorizontal: 41,
	},
	root: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		flexDirection: 'row',
		gap: 16,
		overflow: 'hidden',
		paddingLeft: 32,
		paddingRight: 16,
		paddingVertical: 16,
	},
	textWrap: {
		gap: Gaps.g4,
	},
	thumb: {
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r8,
		borderWidth: 1,
		flex: 1,
	},
	thumbPlaceholder: {
		backgroundColor: Colors.grayBackground,
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r8,
		borderWidth: 10,
		flex: 1,
	},
	thumbWrap: { height: THUMB, width: THUMB },
	title: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
	},
});

export default NewTicketItem;
