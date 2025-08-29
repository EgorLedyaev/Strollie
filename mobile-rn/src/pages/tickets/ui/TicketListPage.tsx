import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useEffect, useMemo, useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ShowTicketQrDialog } from '@/features/show-ticket-qr';
import { TicketDetailsDialog } from '@/features/ticket-details';
import {
	ticketApi,
	TicketCard,
	ticketsAtom,
	type Ticket,
} from '@/entities/ticket';
import { Colors, Sizes } from '@/shared/tokens';
import { AppText, BackButton } from '@/shared/ui';

export const TicketListPage: React.FC = () => {
	const [tickets, setTickets] = useAtom(ticketsAtom);
	const [qrVisible, setQrVisible] = useState(false);
	const [qrUri, setQrUri] = useState<string | undefined>();
	const [detailsVisible, setDetailsVisible] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		let mounted = true;
		if (tickets.length === 0) {
			setIsLoading(true);
			ticketApi
				.getMyTickets()
				.then(data => {
					if (!mounted) return;
					setTickets(data);
				})
				.finally(() => mounted && setIsLoading(false));
		}
		return () => {
			mounted = false;
		};
	}, [tickets.length, setTickets]);

	const sections = useMemo(() => {
		const startOfToday = new Date();
		startOfToday.setHours(0, 0, 0, 0);
		const endOfToday = new Date();
		endOfToday.setHours(23, 59, 59, 999);

		const today = tickets.filter(t => {
			const d = new Date(t.departureTime);
			return d >= startOfToday && d <= endOfToday;
		});
		const future = tickets.filter(
			t => new Date(t.departureTime) > endOfToday,
		);

		const byAsc = (a: Ticket, b: Ticket) =>
			+new Date(a.departureTime) - +new Date(b.departureTime);

		const result: Array<{ title: string; data: Ticket[] }> = [];
		if (today.length)
			result.push({ title: 'Сегодня', data: today.sort(byAsc) });
		if (future.length)
			result.push({
				title: 'В последующие дни',
				data: future.sort(byAsc),
			});
		return result;
	}, [tickets]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<BackButton variant='icon' onPress={() => router.back()} />
				<AppText style={styles.headerTitle}>Мои билеты</AppText>
				<View
					style={{ width: Sizes.button.sm, height: Sizes.button.sm }}
				/>
			</View>
			<View style={styles.content}>
				{isLoading && !tickets.length ? (
					<AppText>Загрузка…</AppText>
				) : !sections.length ? (
					<AppText>Пока нет билетов</AppText>
				) : (
					<SectionList
						sections={sections}
						keyExtractor={item => item.id}
						renderSectionHeader={({ section }) => (
							<AppText
								style={
									section.title === 'Сегодня'
										? styles.sectionToday
										: styles.sectionFuture
								}
							>
								{section.title}
							</AppText>
						)}
						renderItem={({ item }) => (
							<View style={styles.listItem}>
								<TicketCard
									ticket={item}
									onShowQr={() => {
										setQrUri(item.qrCodeUrl);
										setQrVisible(true);
									}}
									onMorePress={() => {
										setSelectedTicket(item);
										setDetailsVisible(true);
									}}
								/>
							</View>
						)}
						contentContainerStyle={styles.listContent}
					/>
				)}
			</View>
			<ShowTicketQrDialog
				visible={qrVisible}
				onClose={() => setQrVisible(false)}
				qrUri={qrUri}
				title='QR код билета'
			/>
			<TicketDetailsDialog
				visible={detailsVisible}
				onClose={() => {
					setDetailsVisible(false);
					setSelectedTicket(null);
				}}
				ticket={selectedTicket}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightBackground,
		padding: 16,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: Colors.headerAndInputText ?? Colors.black,
		textAlign: 'center',
	},
	content: {
		// белыми остаются только карточки билетов
		flex: 1,
	},
	sectionToday: {
		color: Colors.greenLink,
		fontSize: 20,
		fontWeight: '700',
		marginBottom: 8,
		marginTop: 8,
	},
	sectionFuture: {
		color: Colors.grayText,
		fontSize: 20,
		fontWeight: '700',
		marginBottom: 8,
		marginTop: 24,
	},
	listContent: { paddingBottom: 24 },
	listItem: { marginBottom: 16 },
});
