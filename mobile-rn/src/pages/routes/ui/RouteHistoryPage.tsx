import no_history from '@/assets/images/routes/no-history.png';
import { useAtom } from 'jotai';
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
import { RouteCard } from '@/features/route-card';
import { Route, RoutesErrorState, useRoutesSWR } from '@/entities/route';
import { favoriteRouteIdsAtom } from '@/entities/route/model/route.state';
import { bindLogger } from '@/shared/lib/logger';
import { Colors, Fonts } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

export const RouteHistoryPage: React.FC = () => {
	// const { routes, isHydrated: hydrated, isLoading, error } = useRoutesSWR();
	const { routes, isHydrated, isLoading, error } = useRoutesSWR();

	// Feature scoped logger
	const log = useMemo(() => bindLogger('tickets'), []);

	// Mount log (один раз при инициализации экрана)
	useEffect(() => {
		log.info('mount');
	}, [log]);

	// const showEmpty = hydrated && !isLoading; // всегда показываем EmptyState
	const showEmpty = isHydrated && !isLoading && routes.length === 0;

	const sections = useMemo(() => {
		const startOfToday = new Date();
		startOfToday.setHours(0, 0, 0, 0);

		const today = routes.filter(r => new Date(r.date) >= startOfToday);
		const previous = routes.filter(r => new Date(r.date) < startOfToday);

		const byDesc = (a: Route, b: Route) =>
			+new Date(b.date) - +new Date(a.date);

		const result: Array<{ title: string; data: Route[] }> = [];
		if (today.length > 0) {
			result.push({ title: 'Сегодня', data: today.sort(byDesc) });
		}
		if (previous.length > 0) {
			result.push({
				title: 'В предыдущие дни',
				data: previous.sort(byDesc),
			});
		}
		return result;
	}, [routes]);

	const [favoriteRouteIds, setFavoriteRouteIds] =
		useAtom(favoriteRouteIdsAtom);

	const routesWithFavorites = useMemo(() => {
		return routes.map(route => ({
			...route,
			isFavorite: favoriteRouteIds.includes(route.id),
		}));
	}, [routes, favoriteRouteIds]);

	const toggleFavorite = useCallback(
		(routeId: string) => {
			setFavoriteRouteIds(prevIds => {
				const isFavorite = prevIds.includes(routeId);
				if (isFavorite) {
					return prevIds.filter(id => id !== routeId);
				} else {
					return [...prevIds, routeId];
				}
			});
		},
		[routesWithFavorites],
	);

	return (
		<SafeAreaView style={styles.root}>
			<Header title='История маршрутов' />

			{isLoading ? (
				<View style={styles.loadingWrap} testID='history-loading'>
					<ActivityIndicator
						size='large'
						color={Colors.greenPrimary}
					/>
				</View>
			) : error ? (
				<View style={styles.loadingWrap} testID='history-error'>
					<RoutesErrorState />
				</View>
			) : showEmpty ? (
				<View style={styles.container}>
					<EmptyState
						image={
							<Image
								source={no_history}
								style={styles.emptyImage}
							/>
						}
						title='Вы еще не проходили маршруты'
						description='Здесь будут храниться все пройденные вами маршруты'
						testId='history-empty'
					/>
				</View>
			) : (
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					<View testID='history-list'>
						{sections.map(section => (
							<View key={section.title} style={styles.section}>
								<AppText
									style={[
										styles.sectionHeader,
										section.title === 'Сегодня'
											? styles.todayHeader
											: styles.previousHeader,
									]}
								>
									{section.title}
								</AppText>

								{section.data.map(route => (
									<RouteCard
										key={route.id}
										route={route}
										onToggleFavorite={toggleFavorite}
									/>
								))}
							</View>
						))}
					</View>
				</ScrollView>
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
		height: 265,
		resizeMode: 'contain',
		width: 265,
	},
	loadingWrap: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		paddingTop: 80,
	},

	previousHeader: {
		color: Colors.lightInputText,
		paddingTop: 16,
	},

	root: {
		backgroundColor: Colors.grayBackground,
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	scrollContent: {
		paddingTop: 33,
	},
	section: {
		gap: 16,
	},
	sectionHeader: {
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
		paddingLeft: 16,
	},
	todayHeader: {
		color: Colors.successGreen,
	},
});

export default RouteHistoryPage;
