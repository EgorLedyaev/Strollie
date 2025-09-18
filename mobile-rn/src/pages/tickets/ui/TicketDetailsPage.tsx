import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import {
	SafeAreaView,
} from 'react-native-safe-area-context';

import { ticketsAtom, type Ticket } from '@/entities/ticket';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText, BackButton, IconButton } from '@/shared/ui';

interface TicketDetailsPageProps {
	ticketId: string;
}

export const TicketDetailsPage: React.FC<TicketDetailsPageProps> = ({
	ticketId,
}) => {
	const [tickets] = useAtom<Ticket[]>(ticketsAtom);
	const ticket = tickets.find(t => t.id === ticketId);
	const router = useRouter();

	if (!ticket) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.emptyWrap}>
					<BackButton variant='icon' onPress={() => router.back()} />
					<AppText>Билет не найден</AppText>
				</View>
			</SafeAreaView>
		);
	}

	const departure = new Date(ticket.departureTime);
	const qrUri = ticket.qrCodeUrl;
	const isCinema = ticket.type === 'other';
	const title = isCinema ? ticket.to : `${ticket.from} - ${ticket.to}`;

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<BackButton
					variant='icon'
					style={styles.backButton}
					onPress={() => router.back()}
				/>
				<View style={styles.card}>
					{qrUri ? (
						<Image
							source={{ uri: qrUri }}
							style={styles.qr}
							resizeMode='contain'
						/>
					) : null}

					<AppText style={styles.ticketNo}>
						№{ticket.id.slice(-6).toUpperCase()}
					</AppText>

					<View style={styles.dateTimeRow}>
						<AppText style={styles.dateText}>
							{departure.toLocaleDateString()}
						</AppText>
						<AppText style={styles.timeText}>
							{departure.toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit',
							})}
						</AppText>
					</View>

					<View style={styles.metaTripRow}>
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
							<View style={styles.metaCol}>
								<AppText style={styles.metaLabel}>
									Место
								</AppText>
								<AppText style={styles.metaValue}>
									{ticket.seat}
								</AppText>
							</View>
						) : null}
					</View>

					<View style={styles.infoBlock}>
						<View style={styles.infoRow}>
							<AppText style={styles.infoLabel}>
								{isCinema ? 'Фильм' : 'Маршрут'}
							</AppText>
							<AppText style={styles.infoValue}>{title}</AppText>
						</View>
						{ticket.carrierInfo?.name ? (
							<View style={styles.infoRow}>
								<AppText style={styles.infoLabel}>
									{isCinema ? 'Кинотеатр' : 'Перевозчик'}
								</AppText>
								<AppText style={styles.infoValue}>
									{ticket.carrierInfo.name}
								</AppText>
							</View>
						) : null}
					</View>

					<IconButton
						style={styles.refundBtn}
						feedback='opacity'
						opacity={0.6}
					>
						<AppText style={styles.refundText}>
							Вернуть билет
						</AppText>
					</IconButton>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	backButton: {
		left: 16,
		position: 'absolute',
		top: 16,
		zIndex: 999,
	},
	card: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		paddingHorizontal: 24,
		paddingVertical: 24,
	},
	container: {
		backgroundColor: Colors.lightBackground,
		flex: 1,
		padding: 16,
	},
	dateText: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
	},
	dateTimeRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 32,
		marginBottom: 16,
	},
	emptyWrap: { alignItems: 'center', flex: 1, justifyContent: 'center' },
	infoBlock: {
		gap: 16,
		marginBottom: 24,
		width: '100%',
	},
	infoLabel: {
		color: Colors.grayText,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f20,
	},
	infoRow: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	infoValue: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
	},
	metaCol: {
		alignItems: 'flex-start',
		width: 60,
	},
	metaLabel: {
		color: Colors.grayText,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f20,
	},
	metaTripRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 32,
		marginBottom: 24,
	},
	metaValue: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f20,
	},
	qr: {
		height: 201,
		marginBottom: 16,
		marginTop: 16,
		width: 201,
	},
	refundBtn: {
		backgroundColor: Colors.grayBackground,
		borderRadius: 10,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	refundText: {
		color: Colors.error,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
	},
	scrollContent: {
		paddingBottom: 24,
		paddingTop: 8,
	},
	ticketNo: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
		marginBottom: 16,
	},
	timeText: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
	},
});
