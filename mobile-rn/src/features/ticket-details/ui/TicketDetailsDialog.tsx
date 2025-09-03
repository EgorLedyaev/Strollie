import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import type { Ticket } from '@/entities/ticket';
import { Colors, Fonts } from '@/shared/tokens';
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
							{formatFullDate(new Date(ticket.departureTime))}
						</AppText>
						<AppText style={styles.timeText}>
							{formatTime(new Date(ticket.departureTime))}
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
	return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function formatFullDate(d: Date) {
	return d.toLocaleDateString('ru-RU', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	});
}
function formatDateTimeRange(iso: string) {
	const d = new Date(iso);
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
	ticketCard: {
		gap: 24,
		alignItems: 'stretch',
	},
	qrImage: {
		alignSelf: 'center',
		width: 200,
		height: 200,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.inputBorder,
		backgroundColor: Colors.white,
		marginTop: 8,
	},
	ticketNumber: {
		marginTop: 12,
		textAlign: 'center',
		fontSize: Fonts.f20,
		fontFamily: Fonts.bold,
		color: Colors.headerAndInputText,
	},
	dateTimeRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 32,
	},
	dateText: {
		fontSize: Fonts.f16,
		fontFamily: Fonts.medium,
		color: Colors.headerAndInputText,
		textAlign: 'center',
	},
	timeText: {
		fontSize: Fonts.f20,
		fontFamily: Fonts.bold,
		color: Colors.headerAndInputText,
		textAlign: 'center',
	},
	hrGroup: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-start',
		gap: 32,
	},
	hrBlock: { gap: 4, alignItems: 'flex-start' },
	hrLabel: {
		fontSize: Fonts.f16,
		fontFamily: Fonts.semibold,
		color: Colors.headerAndInputText,
	},
	hrValue: {
		fontSize: Fonts.f16,
		fontFamily: Fonts.regular,
		color: Colors.headerAndInputText,
	},
	fieldsColumn: { gap: 16 },
	fieldRow: { gap: 4 },
	fieldLabel: {
		fontSize: Fonts.f16,
		fontFamily: Fonts.medium,
		color: Colors.textGray,
	},
	fieldValue: {
		fontSize: Fonts.f16,
		fontFamily: Fonts.bold,
		color: Colors.headerAndInputText,
	},
	refundBtn: {
		alignSelf: 'center',
		backgroundColor: Colors.grayBackground,
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 10,
	},
	refundText: {
		fontSize: Fonts.f16,
		fontFamily: Fonts.regular,
		color: Colors.red,
	},
	closeBtn: { height: 43 },
});

export default TicketDetailsDialog;
