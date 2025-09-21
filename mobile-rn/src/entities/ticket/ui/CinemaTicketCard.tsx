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
	card: {
		backgroundColor: Colors.white,
		borderBottomRightRadius: Radius.r15,
		borderTopRightRadius: Radius.r15,
		boxShadow: Shadows.boxShadow_elev1,
		flex: 1,
		flexDirection: 'column',
		height: 200,
		padding: 16,
	},
	footer: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 7,
		marginTop: 'auto',
	},
	headerRow: { marginBottom: 8 },
	leftBox: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderBottomLeftRadius: Radius.r15,
		borderColor: Colors.inputBorder,
		borderRightWidth: 1,
		borderTopLeftRadius: Radius.r15,
		boxShadow: Shadows.boxShadow_elev1,
		height: 200,
		justifyContent: 'center',
		padding: 8,
		width: 120,
	},
	metaCol: { gap: 7, width: 25 },
	metaColWide: { gap: 7, width: 44 },
	metaLabel: { color: Colors.grayText, fontSize: Fonts.f14 },
	metaLeftText: { color: Colors.grayText, fontSize: Fonts.f14 },
	metaRightText: { color: Colors.headerAndInputText, fontSize: Fonts.f20 },
	metaRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
	metaValue: { color: Colors.headerAndInputText, fontSize: Fonts.f14 },
	more: { color: Colors.placeholderGray, fontSize: Fonts.f14 },
	qrPreview: {
		backgroundColor: Colors.white,
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r8,
		borderWidth: 1,
		height: 96,
		marginBottom: 8,
		width: 96,
	},
	ticketDate: { color: Colors.placeholderGray, fontSize: Fonts.f14 },
	ticketNo: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f14,
	},
	title: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f20,
	},
	topMetaLeft: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 8,
		maxWidth: '60%',
	},
	topMetaRight: { alignItems: 'center', flexDirection: 'row', gap: 8 },
	topMetaRow: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	typeIconWrap: { bottom: 24, position: 'absolute', right: 24 },
	wrap: { flexDirection: 'row', gap: 0 },
});

export default CinemaTicketCard;
