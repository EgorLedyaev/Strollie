import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

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
export const NewTicketItem: React.FC<Props> = ({ ticket }) => {
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
				<AppText style={styles.title} numberOfLines={1}>
					{title}
				</AppText>
				<AppText style={styles.date}>{formatDate(departure)}</AppText>
				{ticket.businessCategory ? (
					<View style={styles.badge}>
						<AppText style={styles.badgeText} numberOfLines={1}>
							{ticket.businessCategory}
						</AppText>
					</View>
				) : null}
				{/* Декоративные вертикальные точки */}
				<View style={styles.dots} pointerEvents='none'>
					<View style={styles.dot} />
					<View style={styles.dot} />
					<View style={styles.dot} />
				</View>
			</View>
		</View>
	);
};

const THUMB = 64;

const styles = StyleSheet.create({
	badge: {
		alignSelf: 'flex-start',
		backgroundColor: Colors.successGreen,
		borderRadius: Radius.r15,
		maxWidth: '75%',
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
	badgeText: {
		color: Colors.white,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f12,
	},
	date: {
		color: Colors.secondaryText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		marginBottom: 6,
	},
	dot: {
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r8 / 2,
		height: 4,
		width: 4,
	},
	dots: {
		height: '100%',
		justifyContent: 'space-between',
		paddingVertical: 4,
		position: 'absolute',
		right: -12,
		top: 0,
	},
	mainCol: { flex: 1, position: 'relative' },
	root: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		flexDirection: 'row',
		gap: 16,
		paddingLeft: 16,
		paddingRight: 24,
		paddingVertical: 16,
	},
	thumb: { borderRadius: Radius.r15, height: '100%', width: '100%' },
	thumbPlaceholder: {
		backgroundColor: Colors.grayBackground,
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r15,
		borderWidth: 1,
		height: '100%',
		width: '100%',
	},
	thumbWrap: { height: THUMB, width: THUMB },
	title: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
	},
});

export default NewTicketItem;
