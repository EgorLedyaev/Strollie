import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import type { Ticket } from '@/entities/ticket';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppButton, AppText } from '@/shared/ui';
import { Dialog } from '@/shared/ui/Dialog';

interface Props {
	visible: boolean;
	onClose: () => void;
	ticket: Ticket | null;
}

export const TicketDetailsDialog: React.FC<Props> = ({
	visible,
	onClose,
	ticket,
}) => {
	return (
		<Dialog
			visible={visible}
			onClose={onClose}
			title={ticket ? 'Билет' : 'Билет'}
			actions={
				<AppButton
					onPress={onClose}
					variant='outline'
					text='Закрыть'
					textColor=''
					style={styles.closeBtn}
				/>
			}
		>
			{!ticket ? (
				<AppText>Нет данных</AppText>
			) : (
				<View style={styles.ticketCard}>
					{/* QR-код (если есть) */}
					{ticket.qrCodeUrl ? (
						<Image
							source={{ uri: ticket.qrCodeUrl }}
							style={styles.qrImage}
							resizeMode='contain'
						/>
					) : null}
					<AppText style={styles.ticketNumber}>
						{humanTicketNo(ticket.id)}
					</AppText>
					{/* Дата / время отправления */}
					<View style={styles.dateTimeRow}>
						<AppText style={styles.dateText}>
							{formatFullDate(parseISO(ticket.departureTime))}
						</AppText>
						<AppText style={styles.timeText}>
							{formatTime(parseISO(ticket.departureTime))}
						</AppText>
					</View>
					{/* Зал / Ряд / Место (для кино или если данные присутствуют) */}
					{(ticket.hall || ticket.row || ticket.seat) && (
						<View style={styles.hrGroup}>
							{ticket.hall ? (
								<View style={styles.hrBlock}>
									<AppText style={styles.hrLabel}>
										Зал
									</AppText>
									<AppText style={styles.hrValue}>
										{ticket.hall}
									</AppText>
								</View>
							) : null}
							{ticket.row ? (
								<View style={styles.hrBlock}>
									<AppText style={styles.hrLabel}>
										Ряд
									</AppText>
									<AppText style={styles.hrValue}>
										{ticket.row}
									</AppText>
								</View>
							) : null}
							{ticket.seat ? (
								<View style={styles.hrBlock}>
									<AppText style={styles.hrLabel}>
										Место
									</AppText>
									<AppText style={styles.hrValue}>
										{ticket.seat}
									</AppText>
								</View>
							) : null}
						</View>
					)}
					{/* Основные поля (динамика по типу) */}
					<View style={styles.fieldsColumn}>
						{isCinema(ticket) ? (
							<>
								{renderField('Фильм', ticket.to)}
								{renderField('Кинотеатр', ticket.from)}
								{ticket.address
									? renderField('Адрес', ticket.address)
									: null}
							</>
						) : (
							<>
								{renderField(
									'Маршрут',
									`${ticket.from} — ${ticket.to}`,
								)}
								{ticket.carrierInfo?.name
									? renderField(
											'Перевозчик',
											ticket.carrierInfo.name,
										)
									: null}
								{renderField(
									'Отправление',
									formatDateTimeRange(ticket.departureTime),
								)}
								{renderField(
									'Прибытие',
									formatDateTimeRange(ticket.arrivalTime),
								)}
							</>
						)}
						{ticket.price != null
							? renderField(
									'Стоимость',
									formatPrice(ticket.price, ticket.currency),
								)
							: null}
					</View>
					{/* Вернуть билет (пока без логики) */}
					<View style={styles.refundBtn}>
						<AppText style={styles.refundText}>
							Вернуть билет
						</AppText>
					</View>
				</View>
			)}
		</Dialog>
	);
};

function humanTicketNo(id: string) {
	const tail = id.slice(-6).toUpperCase();
	return `№${tail}`;
}
function formatTime(d: Date) {
	return format(d, 'HH:mm', { locale: ru });
}
function formatFullDate(d: Date) {
	return format(d, 'dd MMMM yyyy', { locale: ru });
}
function formatDateTimeRange(iso: string) {
	const d = parseISO(iso);
	return `${formatFullDate(d)} ${formatTime(d)}`;
}
function formatPrice(value: number, currency = 'RUB') {
	try {
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency,
			maximumFractionDigits: 0,
		}).format(value);
	} catch {
		return `${value} ${currency}`;
	}
}
function renderField(label: string, value: string) {
	return (
		<View style={styles.fieldRow} key={label}>
			<AppText style={styles.fieldLabel}>{label}</AppText>
			<AppText style={styles.fieldValue}>{value}</AppText>
		</View>
	);
}

function isCinema(ticket: Ticket) {
	// Пока не введён отдельный тип для кино, эвристика: есть hall или row и type === 'other'
	return (
		ticket.type === 'other' &&
		(!!ticket.hall || !!ticket.row || !!ticket.seat)
	);
}

const styles = StyleSheet.create({
	closeBtn: { height: 43 },
	dateText: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
		textAlign: 'center',
	},
	dateTimeRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 32,
		justifyContent: 'center',
	},
	fieldLabel: {
		color: Colors.secondaryText,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
	},
	fieldRow: { gap: 4 },
	fieldValue: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
	},
	fieldsColumn: { gap: 16 },
	hrBlock: { alignItems: 'flex-start', gap: 4 },
	hrGroup: {
		alignItems: 'flex-start',
		flexDirection: 'row',
		gap: 32,
		justifyContent: 'center',
	},
	hrLabel: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
	},
	hrValue: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
	},
	qrImage: {
		alignSelf: 'center',
		backgroundColor: Colors.white,
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r10,
		borderWidth: 1,
		height: 200,
		marginTop: 8,
		width: 200,
	},
	refundBtn: {
		alignSelf: 'center',
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r10,
		paddingHorizontal: 24,
		paddingVertical: 12,
	},
	refundText: {
		color: Colors.red,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
	},
	ticketCard: {
		alignItems: 'stretch',
		gap: 24,
	},
	ticketNumber: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
		marginTop: 12,
		textAlign: 'center',
	},
	timeText: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
		textAlign: 'center',
	},
});

export default TicketDetailsDialog;
