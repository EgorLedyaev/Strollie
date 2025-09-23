import no_history from '@/assets/images/routes/no-history.png';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/widgets/empty-state';
import { Header } from '@/widgets/header';
import { useTicketsSWR } from '@/entities/ticket';
import { TicketsErrorState } from '@/entities/ticket/ui/TicketsErrorState';
import { bindLogger } from '@/shared/lib/logger';
import { Colors } from '@/shared/tokens';

export const RouteHistoryPage: React.FC = () => {
	const { isHydrated: hydrated, isLoading, error } = useTicketsSWR();

	// Feature scoped logger
	const log = useMemo(() => bindLogger('tickets'), []);

	// Mount log (один раз при инициализации экрана)
	useEffect(() => {
		log.info('mount');
	}, [log]);

	const showEmpty = hydrated && !isLoading; // всегда показываем EmptyState

	return (
		<SafeAreaView style={styles.root}>
			<Header title='История маршрутов' />

			{isLoading ? (
				<View style={styles.loadingWrap} testID='favourites-loading'>
					<ActivityIndicator
						size='large'
						color={Colors.greenPrimary}
					/>
				</View>
			) : error ? (
				<View style={styles.loadingWrap} testID='favourites-error'>
					<TicketsErrorState />
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
	root: {
		backgroundColor: Colors.grayBackground,
		flex: 1,
		padding: 16,
	},
});

export default RouteHistoryPage;
