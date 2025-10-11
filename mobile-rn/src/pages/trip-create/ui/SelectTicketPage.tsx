import AddTicketIcon from '@/assets/icons/tickets/AddTicketIcon';
import tickets_empty from '@/assets/images/tickets/tickets-empty.png';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/widgets/empty-state';
import { Header } from '@/widgets/header';
import { TicketsList } from '@/widgets/tickets-list';
import {
	editingTripTicketsAtom,
	selectedTicketsAtom,
} from '@/features/manage-trips';
import { TicketsErrorState, useTicketsSWR } from '@/entities/ticket';
import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppButton, AppText } from '@/shared/ui';

export const SelectTicketPage = () => {
	const router = useRouter();
	const params = useLocalSearchParams(); // Получаем параметры навигации
	const mode = params.mode === 'edit' ? 'edit' : 'create'; // Определяем режим
	const {
		tickets,
		isHydrated: hydrated,
		isLoading,
		error,
		forceRefresh,
	} = useTicketsSWR();

	// const [, setSelectedTickets] = useAtom(selectedTicketsAtom);
	// const initialSelectedTickets = useAtomValue(selectedTicketsAtom);
	// const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>(() => {
	// 	return initialSelectedTickets.map(ticket => ticket.id);
	// });
	const [create_selectedTickets, create_setSelectedTickets] =
		useAtom(selectedTicketsAtom);
	const [edit_selectedTickets, edit_setSelectedTickets] = useAtom(
		editingTripTicketsAtom,
	);
	const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>(() => {
		if (mode === 'edit' && edit_selectedTickets) {
			return edit_selectedTickets.map(ticket => ticket.id);
		}
		return create_selectedTickets.map(ticket => ticket.id);
	});

	const handleTicketSelect = (ticketId: string) => {
		setSelectedTicketIds(prevIds => {
			if (prevIds.includes(ticketId)) {
				return prevIds.filter(id => id !== ticketId);
			} else {
				return [...prevIds, ticketId];
			}
		});
	};

	const handleConfirmSelection = () => {
		const finalSelectedTickets = tickets.filter(ticket =>
			selectedTicketIds.includes(ticket.id),
		);
		if (mode === 'edit') {
			edit_setSelectedTickets(finalSelectedTickets);
		} else {
			create_setSelectedTickets(finalSelectedTickets);
		}
		router.back();
	};

	const showEmpty = hydrated && !isLoading && tickets.length === 0;

	const imageNode = (
		<View>
			<Image
				source={tickets_empty}
				style={[styles.image, styles.imageRotated]}
			/>
			<Image source={tickets_empty} style={styles.image} />
		</View>
	);

	const actionNode = (
		<AppButton
			onPress={() => router.push('/tickets/add')}
			buttonBorderRadius={Radius.r16}
			textFontSize={Fonts.f16}
			textFontFamily={Fonts.medium}
			style={styles.addButtonEmpty}
		>
			<View style={styles.addButtonContent}>
				<AddTicketIcon />
				<AppText variant='button' style={styles.addButtonText}>
					Добавить билет
				</AppText>
			</View>
		</AppButton>
	);

	return (
		<SafeAreaView style={styles.root}>
			<Header title={'Мои билеты'} />
			{isLoading ? (
				<View style={styles.loadingWrap} testID='tickets-loading'>
					<ActivityIndicator
						size='large'
						color={Colors.greenPrimary}
					/>
				</View>
			) : error ? (
				<View style={styles.loadingWrap}>
					<TicketsErrorState onRetry={() => forceRefresh()} />
				</View>
			) : showEmpty ? (
				<View style={styles.emptyContainer}>
					<EmptyState
						title='Билетов пока нет'
						description='Здесь можно хранить свои билеты на различные мероприятия или рейсы'
						image={imageNode}
						action={actionNode}
						testId='tickets-empty'
					/>
				</View>
			) : (
				<>
					<TicketsList
						tickets={tickets}
						onTicketPress={handleTicketSelect}
						selectedTicketIds={selectedTicketIds}
					/>

					<View style={styles.fabContainer}>
						<AppButton
							onPress={handleConfirmSelection}
							// onPress={() => router.push('/tickets/add')}
							disabled={selectedTicketIds.length === 0}
							buttonBorderRadius={Radius.r16}
							style={styles.addButton}
						>
							{/*<AddTicketIcon />*/}
							{/*Тут должна быть кнопка перебрасывающая на экран с добавлением билета,
						но тогда у нас нет сохранения билета в поездку*/}
							<AppText variant='button'>Сохранить</AppText>
						</AppButton>
					</View>
				</>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	addButton: {
		height: 52,
		width: 215,
	},
	addButtonContent: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: Gaps.g8,
	},
	addButtonEmpty: { height: 52, width: '100%' },
	addButtonText: {
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'flex-start',
		paddingTop: 80,
	},
	fabContainer: {
		alignItems: 'center',
		bottom: 58,
		height: 56,
		position: 'absolute',
		right: 16,
	},
	image: {
		alignSelf: 'center',
		height: 265,
		justifyContent: 'center',
		marginBottom: Gaps.g20,
		resizeMode: 'contain',
		width: 265,
	},
	imageRotated: { position: 'absolute', transform: [{ rotate: '-15deg' }] },
	loadingWrap: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
	root: {
		backgroundColor: Colors.grayBackground,
		flex: 1,
		padding: 16,
	},
});

export default SelectTicketPage;
