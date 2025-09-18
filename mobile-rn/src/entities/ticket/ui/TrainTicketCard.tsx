import ArrowRightLineIcon from '@/assets/icons/arrow/ArrowRightLineIcon';
import ArrowUpRightSmallIcon from '@/assets/icons/arrow/ArrowUpRightSmallIcon';
import TrainIcon from '@/assets/icons/tickets/TrainIcon';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';

import type { Ticket } from '../model';

interface Props {
	ticket: Ticket; // ожидается ticket.type === 'train'
	onShowQr?: () => void;
	onMorePress?: () => void;
}

function humanTicketNo(id: string) {
	const tail = id.slice(-6).toUpperCase();
	return `№${tail}`;
}

function formatTime(d: Date) {
	return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function pad2(n: number) {
	return n < 10 ? `0${n}` : `${n}`;
}
function formatDate(d: Date) {
	// dd.MM.yyyy — точки вместо слэшей
	return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function formatDuration(from: Date, to: Date) {
	const ms = Math.max(0, +to - +from);
	const h = Math.floor(ms / 3_600_000);
	const m = Math.round((ms % 3_600_000) / 60_000);
	if (h >= 1) return `${h} ч${m ? ` ${m} мин` : ''}`;
	return `${m} мин`;
}

export const TrainTicketCard: React.FC<Props> = ({
	ticket,
	onShowQr,
	onMorePress,
}) => {
	const departure = new Date(ticket.departureTime);
	const arrival = new Date(ticket.arrivalTime);
	// Между городами оставляем тире
	const title = `${ticket.from} - ${ticket.to}`;

	return (
		<View style={styles.wrap}>
			<IconButton
				onPress={onShowQr}
				feedback='opacity'
				opacity={0.6}
				style={styles.leftBox}
			>
				{ticket.qrCodeUrl ? (
					<Image
						source={{ uri: ticket.qrCodeUrl }}
						style={styles.qrPreview}
						resizeMode='contain'
					/>
				) : null}
				<AppText style={styles.ticketNo}>
					{humanTicketNo(ticket.id)}
				</AppText>
				<AppText style={styles.ticketDate}>
					{formatDate(departure)}
				</AppText>
			</IconButton>

			<View style={styles.card}>
				{/* Иконка типа билета в правом нижнем углу карточки */}
				<View style={styles.typeIconWrap}>
					<TrainIcon />
				</View>

				<View style={styles.headerRow}>
					<AppText style={styles.title} numberOfLines={1}>
						{title}
					</AppText>
				</View>

				{/* Временная полоса (отправление — длительность — прибытие) */}
				<View style={styles.infoRow}>
					<View style={styles.block}>
						<AppText style={styles.infoMain}>
							{formatTime(departure)}
						</AppText>
						<AppText style={styles.infoSub}>местное время</AppText>
						<AppText style={styles.infoMinor}>
							{formatDate(departure)}
						</AppText>
					</View>
					<View style={styles.blockMid}>
						<AppText style={styles.duration}>
							{formatDuration(departure, arrival)}
						</AppText>
						{/* Горизонтальная стрелка по макету */}
						<ArrowRightLineIcon
							style={styles.arrowIcon}
							fill={Colors.grayTextButtonOverlay}
						/>
					</View>
					<View style={styles.block}>
						<AppText style={styles.infoMain}>
							{formatTime(arrival)}
						</AppText>
						<AppText style={styles.infoSub}>местное время</AppText>
						<AppText style={styles.infoMinor}>
							{formatDate(arrival)}
						</AppText>
					</View>
				</View>

				{/* Только место */}
				{ticket.seat ? (
					<View style={styles.seatRow}>
						<AppText style={styles.metaLabel}>Место</AppText>
						<AppText style={styles.metaValue}>
							{ticket.seat}
						</AppText>
					</View>
				) : null}

				<IconButton
					style={styles.footer}
					onPress={onMorePress}
					feedback='opacity'
					opacity={0.6}
				>
					<AppText style={styles.more}>Подробнее</AppText>
					<ArrowUpRightSmallIcon />
				</IconButton>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	arrowIcon: { marginTop: 6 },

	block: { width: 61 },
	blockMid: { alignItems: 'center', justifyContent: 'center', width: 60 },
	card: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		flex: 1,
		flexDirection: 'column',
		padding: 24,
	},
	duration: { color: Colors.darkGray, fontSize: Fonts.f12 },
	footer: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 7,
		marginTop: 'auto',
	},
	headerRow: { marginBottom: 8 },
	infoMain: { fontSize: Fonts.f20 },
	infoMinor: { color: Colors.secondaryText, fontSize: Fonts.f12 },
	infoRow: {
		alignItems: 'center',
		borderColor: Colors.grayBackground,
		borderWidth: 1,
		flexDirection: 'row',
		gap: 8,
		justifyContent: 'space-between',
		padding: 5,
	},
	infoSub: { color: Colors.placeholderGray, fontSize: Fonts.f12 },
	leftBox: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		justifyContent: 'space-between',
		paddingVertical: 24,
		width: 120,
	},

	metaLabel: { color: Colors.grayText, fontSize: Fonts.f14 },
	metaValue: { fontSize: Fonts.f14 },
	more: { color: Colors.placeholderGray, fontSize: Fonts.f14 },
	qrPreview: {
		backgroundColor: Colors.white,
		height: 96,
		width: 96,
	},
	seatRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 8,
		marginTop: 8,
	},

	ticketDate: {
		color: Colors.textAAA,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f14,
	},
	ticketNo: {
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f14,
	},

	title: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f20,
	},
	typeIconWrap: { bottom: 24, position: 'absolute', right: 24 },

	wrap: { flexDirection: 'row', gap: 1, height: 200 },
});

export default TrainTicketCard;
