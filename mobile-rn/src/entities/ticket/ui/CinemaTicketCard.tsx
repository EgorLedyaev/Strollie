import ArrowUpRightSmallIcon from '@/assets/icons/arrow/ArrowUpRightSmallIcon';
import ClockSmallIcon from '@/assets/icons/clock/ClockSmallIcon';
import MarkerSmallIcon from '@/assets/icons/marker/MarkerSmallIcon';
import CinemaIcon from '@/assets/icons/tickets/CinemaIcon';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';

import type { Ticket } from '../model';

interface Props {
	ticket: Ticket; // ожидается ticket.type === 'other'
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

export const CinemaTicketCard: React.FC<Props> = ({
	ticket,
	onShowQr,
	onMorePress,
}) => {
	const departure = new Date(ticket.departureTime);
	const title = ticket.to;

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
					<CinemaIcon />
				</View>

				<View style={styles.headerRow}>
					<AppText style={styles.title} numberOfLines={1}>
						{title}
					</AppText>
				</View>

				{/* Площадка + время (с иконками) */}
				<View style={styles.topMetaRow}>
					<View style={styles.topMetaLeft}>
						<MarkerSmallIcon />
						<AppText style={styles.metaLeftText} numberOfLines={1}>
							{ticket.carrierInfo?.name}
						</AppText>
					</View>
					<View style={styles.topMetaRight}>
						<ClockSmallIcon />
						<AppText style={styles.metaRightText}>
							{formatTime(departure)}
						</AppText>
					</View>
				</View>

				{/* Зал/Ряд/Место */}
				{ticket.hall || ticket.row || ticket.seat ? (
					<View style={styles.metaRow}>
						{ticket.hall ? (
							<View style={styles.metaCol}>
								<AppText style={styles.metaLabel}>Зал</AppText>
								<AppText style={styles.metaValue}>
									{ticket.hall}
								</AppText>
							</View>
						) : null}
						{ticket.row ? (
							<View style={styles.metaCol}>
								<AppText style={styles.metaLabel}>Ряд</AppText>
								<AppText style={styles.metaValue}>
									{ticket.row}
								</AppText>
							</View>
						) : null}
						{ticket.seat ? (
							<View style={styles.metaColWide}>
								<AppText style={styles.metaLabel}>
									Место
								</AppText>
								<AppText style={styles.metaValue}>
									{ticket.seat}
								</AppText>
							</View>
						) : null}
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
	topMetaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	topMetaLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		maxWidth: '60%',
	},
	metaLeftText: { fontSize: Fonts.f14, color: Colors.grayText },
	topMetaRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	metaRightText: { fontSize: Fonts.f20, color: Colors.headerAndInputText },
	metaRow: { marginTop: 8, flexDirection: 'row', gap: 16 },
	metaCol: { width: 25, gap: 7 },
	metaColWide: { width: 44, gap: 7 },
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

export default CinemaTicketCard;
