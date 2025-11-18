import trips_empty from '@/assets/images/trips/trips-empty.png';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
	ActivityIndicator,
	Image,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/widgets/empty-state';
import { Header } from '@/widgets/header';
import { useTicketsSWR } from '@/entities/ticket';
import { TripsErrorState, useTripsSWR } from '@/entities/trip';
import { bindLogger } from '@/shared/lib/logger';
import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppButton, AppText } from '@/shared/ui';
import { AddButton } from '@/shared/ui/AddButton';

import { TripList } from './TripList';

export const TripMainPage: React.FC = () => {
	const router = useRouter();
	const {
		trips,
		isHydrated: isTripsHydrated,
		isLoading: isLoadingTrips,
		error,
		forceRefresh,
	} = useTripsSWR();

	const log = useMemo(() => bindLogger('trips'), []);

	// Mount log (один раз при инициализации экрана)
	useEffect(() => {
		log.info('mount');
	}, [log]);

	useFocusEffect(
		useCallback(() => {
			forceRefresh();
		}, [forceRefresh]),
	);

	const {
		tickets,
		isHydrated: isTicketsHydrated,
		isLoading: isLoadingTickets,
	} = useTicketsSWR();

	const isHydrated = isTripsHydrated && isTicketsHydrated;
	const isLoading = isLoadingTrips || isLoadingTickets;

	// const showEmpty = hydrated && !isLoading && trips.length !== 0;
	const showEmpty = isHydrated && !isLoading && trips.length === 0;

	const actionNode = (
		<AppButton
			onPress={() => router.push('/trips/new')}
			buttonBorderRadius={Radius.r16}
			textFontSize={Fonts.f16}
			textFontFamily={Fonts.medium}
			style={styles.addButtonEmpty}
		>
			<View style={styles.addButtonContent}>
				<AppText variant='button' style={styles.addButtonText}>
					Создать поездку
				</AppText>
			</View>
		</AppButton>
	);

	return (
		<SafeAreaView style={styles.root}>
			<Header
				title='Мои поездки'
				rightContent={
					<Link href={'/trips/new'} asChild>
						<AddButton />
					</Link>
				}
			/>
			{isLoading ? (
				<View style={styles.loadingWrap} testID='trips-loading'>
					<AppText>{isHydrated}</AppText>
					<AppText>{isLoading}</AppText>
					<ActivityIndicator
						size='large'
						color={Colors.greenPrimary}
					/>
				</View>
			) : error ? (
				<View style={styles.loadingWrap}>
					<TripsErrorState onRetry={() => forceRefresh()} />
				</View>
			) : showEmpty ? (
				<View style={styles.emptyContainer}>
					<EmptyState
						title='Пока что здесь пусто'
						description='Но вы можете это исправить! Спланируйте свою первую поездку'
						image={
							<Image
								source={trips_empty}
								style={styles.emptyImage}
							/>
						}
						action={actionNode}
						testId='trips-empty'
					/>
				</View>
			) : (
				<>
					<ScrollView
						contentContainerStyle={styles.scrollContent}
						showsVerticalScrollIndicator={false}
					>
						<TripList trips={trips} tickets={tickets} />
					</ScrollView>
				</>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
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
	emptyImage: {
		height: 265,
		resizeMode: 'contain',
		width: 265,
	},
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
	scrollContent: {
		paddingBottom: 120,
		paddingTop: 16,
	},
});
