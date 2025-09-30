import trips_empty from '@/assets/images/trips/trips-empty.png';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
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
import { TripsErrorState, useTripsSWR } from '@/entities/trip';
import { bindLogger } from '@/shared/lib/logger';
import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppButton, AppText } from '@/shared/ui';
import { AddButton } from '@/shared/ui/AddButton';

export const TripMainPage: React.FC = () => {
	const router = useRouter();
	const {
		trips,
		isHydrated: hydrated,
		isLoading,
		error,
		forceRefresh,
	} = useTripsSWR();

	const log = useMemo(() => bindLogger('trips'), []);

	// Mount log (один раз при инициализации экрана)
	useEffect(() => {
		log.info('mount');
	}, [log]);

	const showEmpty = hydrated && !isLoading && trips.length !== 0;
	// const showEmpty = hydrated && !isLoading && trips.length === 0;

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
					></ScrollView>
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
	// content: {
	// 	flex: 1,
	// },
	// cardWrap: { marginBottom: 8 },
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
	// fabContainer: {
	// 	alignItems: 'center',
	// 	bottom: 58,
	// 	height: 56,
	// 	position: 'absolute',
	// 	right: 16,
	// },
	// filterBtn: {
	// 	backgroundColor: Colors.white,
	// 	borderColor: Colors.transparent,
	// 	borderRadius: Radius.r8,
	// 	borderWidth: 1,
	// 	height: 32,
	// 	justifyContent: 'center',
	// 	paddingHorizontal: 16,
	// },
	// filterBtnActive: {
	// 	borderColor: Colors.greenPrimary,
	// 	borderWidth: 1,
	// 	boxShadow: Shadows.filterButtonShadow,
	// },
	// filterIconBtn: {
	// 	alignItems: 'center',
	// 	backgroundColor: Colors.white,
	// 	borderRadius: Radius.r8,
	// 	height: 32,
	// 	justifyContent: 'center',
	// 	width: 32,
	// },
	// filterText: {
	// 	color: Colors.lightInputText,
	// 	fontFamily: Fonts.regular,
	// 	fontSize: Fonts.f14,
	// },
	// filterTextActive: {
	// 	color: Colors.successGreen,
	// 	fontFamily: Fonts.regular,
	// 	fontSize: Fonts.f14,
	// },
	// filtersRow: {
	// 	alignItems: 'center',
	// 	flexDirection: 'row',
	// 	gap: 16,
	// 	marginBottom: 16,
	// 	marginLeft: 12,
	// 	marginTop: 32,
	// },
	// futureHeader: {
	// 	color: Colors.secondaryText,
	// 	// fontFamily: Fonts.bold,
	// 	// fontSize: Fonts.f20,
	// },
	// image: {
	// 	alignSelf: 'center',
	// 	height: 265,
	// 	justifyContent: 'center',
	// 	marginBottom: Gaps.g20,
	// 	resizeMode: 'contain',
	// 	width: 265,
	// },
	// imageRotated: { position: 'absolute', transform: [{ rotate: '-15deg' }] },
	// list: {
	// 	gap: 16,
	// 	paddingHorizontal: 20,
	// 	// paddingTop: 24,
	// },
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
	},
	// section: {
	// 	gap: 16,
	// },
	//
	// sectionHeader: {
	// 	fontFamily: Fonts.bold,
	// 	fontSize: Fonts.f20,
	// },
	// todayHeader: {
	// 	color: Colors.greenPrimary,
	// },
});
