import no_favourites from '@/assets/images/routes/no-favourites.png';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/widgets/empty-state';
import { Header } from '@/widgets/header';
import { TicketsErrorState, useTicketsSWR } from '@/entities/ticket';
import { bindLogger } from '@/shared/lib/logger';
import { Colors } from '@/shared/tokens';

export const SavedRoutesPage: React.FC = () => {
	const { isHydrated: hydrated, isLoading, error } = useTicketsSWR();

	// Feature scoped logger
	const log = useMemo(() => bindLogger('tickets'), []);

	// Mount log (один раз при инициализации экрана)
	useEffect(() => {
		log.info('mount');
	}, [log]);

	// Всегда показываем EmptyState (требование пользователя) – даже если есть tickets
	const showEmpty = hydrated && !isLoading; // всегда показываем EmptyState

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
					<TicketsErrorState
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
			) : null}
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
