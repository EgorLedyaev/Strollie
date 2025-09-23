import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';
import { ActionButton } from '@/shared/ui/ActionButton';

import type { Ticket } from '../model';

interface Props {
	ticket: Ticket;
	/** Показать меню действий (опционально) */
	onPressActions?: () => void;
}

function pad2(n: number) {
	return n < 10 ? `0${n}` : `${n}`;
}
function formatDate(d: Date) {
	return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/**
 * Полностью независимый отображатель билета.
 * Не использует старые карточки и их стили.
 * Нет секции для QR – намеренно по требованию.
 */
export const NewTicketItem: React.FC<Props> = ({ ticket, onPressActions }) => {
	const departure = new Date(ticket.departureTime);
	const title =
		ticket.title ||
		[ticket.from, ticket.to].filter(Boolean).join(' - ') ||
		'Билет';

	return (
		<View style={styles.root}>
			{/* Мини изображение/плейсхолдер */}
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
						{formatDate(departure)}
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
		</View>
	);
};

const THUMB = 64;

const styles = StyleSheet.create({
	badgeText: {
		color: Colors.lightInputText,
		fontSize: Fonts.f14,
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
	root: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		flexDirection: 'row',
		gap: 16,
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
