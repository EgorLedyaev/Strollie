import FilterIcon from '@/assets/icons/FilterIcon';
import no_favourites from '@/assets/images/routes/no-favourites.png';
import { useAtom } from 'jotai';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/widgets/empty-state';
import { Header } from '@/widgets/header';
import { PlaceCard } from '@/features/place-card';
import { RouteCard } from '@/features/route-card';
import { Place, usePlacesSWR } from '@/entities/place';
import { favoritePlaceIdsAtom } from '@/entities/place/model/place.state';
import { Route, RoutesErrorState, useRoutesSWR } from '@/entities/route';
import { favoriteRouteIdsAtom } from '@/entities/route/model/route.state';
import { bindLogger } from '@/shared/lib/logger';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

type Filter = 'all' | 'routes' | 'places';

export type FavoriteItem = Route | Place;

export const SavedRoutesPage: React.FC = () => {
	const {
		routes,
		isLoading: isRoutesLoading,
		error: routesError,
	} = useRoutesSWR();
	const {
		places,
		isHydrated,
		isLoading: isPlacesLoading,
		error: placesError,
	} = usePlacesSWR();

	const isLoading = isRoutesLoading || isPlacesLoading;
	const error = routesError || placesError;

	const log = useMemo(() => bindLogger('favourites'), []);

	// Mount log (один раз при инициализации экрана)
	useEffect(() => {
		log.info('mount');
	}, [log]);

	const [favoriteRouteIds, setFavoriteRouteIds] =
		useAtom(favoriteRouteIdsAtom);
	const [favoritePlaceIds, setFavoritePlaceIds] =
		useAtom(favoritePlaceIdsAtom);
	const [filter, setFilter] = useState<Filter>('all');

	const favourites = useMemo<FavoriteItem[]>(() => {
		const favoriteRoutes = routes.filter(r =>
			favoriteRouteIds.includes(r.id),
		);
		const favoritePlaces = places.filter(p =>
			favoritePlaceIds.includes(p.id),
		);

		return [...favoriteRoutes, ...favoritePlaces].sort((a, b) =>
			a.title.localeCompare(b.title),
		);
	}, [routes, favoriteRouteIds, places, favoritePlaceIds]);

	const isRoute = (item: FavoriteItem): item is Route => {
		return typeof item === 'object' && item !== null && 'distance' in item;
	};
	const isPlace = (item: FavoriteItem): item is Place => {
		return typeof item === 'object' && item !== null && 'address' in item;
	};

	const sections = useMemo(() => {
		if (filter === 'all') {
			return favourites;
		}
		if (filter === 'routes') {
			return favourites.filter(isRoute);
		}
		return favourites.filter(isPlace);
	}, [favourites, filter]);

	const toggleRouteFavorite = useCallback(
		(id: string) => {
			setFavoriteRouteIds(p =>
				p.includes(id) ? p.filter(i => i !== id) : [...p, id],
			);
		},
		[setFavoriteRouteIds],
	);

	const togglePlaceFavorite = useCallback(
		(id: string) => {
			setFavoritePlaceIds(p =>
				p.includes(id) ? p.filter(i => i !== id) : [...p, id],
			);
		},
		[setFavoritePlaceIds],
	);

	const showEmpty = isHydrated && !isLoading && favourites.length === 0;

	return (
		<SafeAreaView style={styles.root}>
			<Header title='Избранное' />
			{isLoading ? (
				<View style={styles.loadingWrap} testID='favourites-loading'>
					<ActivityIndicator
						size='large'
						color={Colors.greenPrimary}
					/>
				</View>
			) : error ? (
				<View style={styles.loadingWrap} testID='favourites-error'>
					<RoutesErrorState
						onRetry={() => {
							/* простая перезагрузка: forceRefresh через хук позже */
						}}
					/>
				</View>
			) : showEmpty ? (
				<View style={styles.container}>
					<EmptyState
						image={
							<Image
								source={no_favourites}
								style={styles.emptyImage}
							/>
						}
						title='Нет отложенных мест и маршрутов'
						description='Здесь будут храниться понравившиеся вам места и маршруты'
						testId='favourites-empty'
					/>
				</View>
			) : (
				<>
					<View style={styles.filtersRow}>
						<Pressable style={styles.filterIconBtn}>
							<FilterIcon />
						</Pressable>

						<Pressable
							style={[
								styles.filterBtn,
								filter === 'places' && styles.filterBtnActive,
							]}
							onPress={() => setFilter('places')}
						>
							<AppText
								style={[
									styles.filterText,
									filter === 'places' &&
										styles.filterTextActive,
								]}
							>
								Места
							</AppText>
						</Pressable>
						<Pressable
							style={[
								styles.filterBtn,
								filter === 'routes' && styles.filterBtnActive,
							]}
							onPress={() => setFilter('routes')}
						>
							<AppText
								style={[
									styles.filterText,
									filter === 'routes' &&
										styles.filterTextActive,
								]}
							>
								Маршруты
							</AppText>
						</Pressable>
					</View>
					<ScrollView>
						{sections.map(item => {
							if (isRoute(item)) {
								return (
									<RouteCard
										key={`route-${item.id}`}
										route={item}
										onToggleFavorite={toggleRouteFavorite}
									/>
								);
							} else {
								return (
									<PlaceCard
										key={`place-${item.id}`}
										place={item}
										onToggleFavorite={togglePlaceFavorite}
									/>
								);
							}
						})}
					</ScrollView>
				</>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		paddingTop: 80,
	},
	emptyImage: {
		height: 265, // или любой нужный размер
		resizeMode: 'contain',
		width: 265, // или любой нужный размер
	},
	filterBtn: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r8,
		height: 32,
		justifyContent: 'center',
		paddingHorizontal: 16,
	},
	filterBtnActive: {
		borderColor: Colors.greenPrimary,
		borderWidth: 1,
		...Platform.select({
			ios: {
				shadowColor: Colors.successGreen,
				shadowOffset: { width: 2, height: 4 },
				shadowOpacity: 1,
				shadowRadius: 6,
			},
			android: {
				elevation: 5,
			},
		}),
	},
	filterIconBtn: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r8,
		height: 32,
		justifyContent: 'center',
		width: 32,
	},
	filterText: {
		color: Colors.lightInputText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	filterTextActive: {
		color: Colors.successGreen,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	filtersRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 16,
		marginBottom: 16,
		marginLeft: 12,
		marginTop: 32,
	},
	loadingWrap: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		paddingTop: 80,
	},
	root: {
		backgroundColor: Colors.grayBackground,
		flex: 1,
		padding: 16,
	},
});

export default SavedRoutesPage;
