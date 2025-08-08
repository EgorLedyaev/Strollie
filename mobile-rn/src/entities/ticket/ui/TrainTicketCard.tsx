import ArrowRightLineIcon from '@/assets/icons/arrow/ArrowRightLineIcon';
import ArrowUpRightSmallIcon from '@/assets/icons/arrow/ArrowUpRightSmallIcon';
import TrainIcon from '@/assets/icons/tickets/TrainIcon';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
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
	wrap: { flexDirection: 'row', gap: 0 },
	leftBox: {
		width: 120,
		height: 200,
		backgroundColor: Colors.white,
		borderRightWidth: 1,
		borderColor: Colors.inputBorder,
		borderTopLeftRadius: Radius.r15,
		borderBottomLeftRadius: Radius.r15,
		alignItems: 'center',
		justifyContent: 'center',
		boxShadow: Shadows.boxShadow_elev1,
		padding: 8,
	},
	qrPreview: {
		width: 96,
		height: 96,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Colors.inputBorder,
		backgroundColor: Colors.white,
		marginBottom: 8,
	},
	card: {
		flex: 1,
		height: 200,
		backgroundColor: Colors.white,
		borderTopRightRadius: Radius.r15,
		borderBottomRightRadius: Radius.r15,
		padding: 16,
		boxShadow: Shadows.boxShadow_elev1,
		// Прижать футер вниз
		flexDirection: 'column',
	},
	typeIconWrap: { position: 'absolute', right: 24, bottom: 24 },
	headerRow: { marginBottom: 8 },
	title: {
		fontSize: Fonts.f20,
		color: Colors.headerAndInputText,
		fontFamily: Fonts.medium,
	},
	infoRow: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: Colors.grayBackground,
		padding: 5,
		justifyContent: 'space-between',
		gap: 8,
	},
	block: { width: 61 },
	blockMid: { justifyContent: 'center', alignItems: 'center', width: 60 },
	infoMain: { fontSize: Fonts.f20, color: Colors.headerAndInputText },
	infoSub: { fontSize: Fonts.f12, color: Colors.placeholderGray },
	infoMinor: { fontSize: Fonts.f12, color: Colors.textGray },
	duration: { color: Colors.darkGray, fontSize: Fonts.f12 },
	// Горизонтальная «стрелка» под временем — SVG
	arrowIcon: { marginTop: 6 },
	seatRow: {
		marginTop: 8,
		flexDirection: 'row',
		gap: 8,
		alignItems: 'center',
	},
	metaLabel: { fontSize: Fonts.f14, color: Colors.grayText },
	metaValue: { fontSize: Fonts.f14, color: Colors.headerAndInputText },
	footer: {
		marginTop: 'auto',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 7,
	},
	more: { color: Colors.placeholderGray, fontSize: Fonts.f14 },
	ticketNo: {
		fontSize: Fonts.f14,
		// fontWeight заменен на fontFamily из токенов
		fontFamily: Fonts.bold,
		color: Colors.headerAndInputText,
	},
	ticketDate: { fontSize: Fonts.f14, color: Colors.placeholderGray },
});

export default TrainTicketCard;
