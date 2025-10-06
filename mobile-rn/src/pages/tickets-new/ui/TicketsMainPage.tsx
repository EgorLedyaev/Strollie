import AddTicketIcon from '@/assets/icons/tickets/AddTicketIcon';
import tickets_empty from '@/assets/images/tickets/tickets-empty.png';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/widgets/empty-state';
import { Header } from '@/widgets/header';
import { TicketsList } from '@/widgets/tickets-list';
import { TicketsErrorState, useTicketsSWR } from '@/entities/ticket';
import { bindLogger } from '@/shared/lib/logger';
import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppButton, AppText } from '@/shared/ui';

// legacy FetchState удалён, управление состояниями внутри useTicketsSWR

export const TicketsMainPage: React.FC = () => {
	const router = useRouter();
	const {
		tickets,
		isHydrated: hydrated,
		isLoading,
		error,
		forceRefresh,
	} = useTicketsSWR();

	// Feature scoped logger
	const log = useMemo(() => bindLogger('tickets'), []);

	// Mount log (один раз при инициализации экрана)
	useEffect(() => {
		log.info('mount');
	}, [log]);

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
			<Header title='Мои билеты' />

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
					<TicketsList tickets={tickets} />

					<View style={styles.fabContainer}>
						<AppButton
							onPress={() => router.push('/tickets/add')}
							buttonBorderRadius={Radius.r16}
							style={styles.addButton}
						>
							<View style={styles.addButtonContent}>
								<AddTicketIcon />
								<AppText
									variant='button'
									style={styles.addButtonText}
								>
									Добавить билет
								</AppText>
							</View>
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
	// errorText стиль удалён (ошибка не показывается в текущей реализации)
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

export default TicketsMainPage;
