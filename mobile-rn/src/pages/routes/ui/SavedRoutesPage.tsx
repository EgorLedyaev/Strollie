import no_favourites from '@/assets/images/routes/no-favourites.png';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/widgets/empty-state';
import { ticketApi, ticketsAtom } from '@/entities/ticket';
import { bindLogger } from '@/shared/lib/logger';
import { Colors, Fonts, Sizes } from '@/shared/tokens';
import { AppText, BackButton } from '@/shared/ui';

type FetchState = 'loading' | 'loaded' | 'error';

export const SavedRoutesPage: React.FC = () => {
	const router = useRouter();
	const [tickets, setTickets] = useAtom(ticketsAtom);
	// Управляем этапами загрузки чтобы избежать мерцания
	const [fetchState, setFetchState] = useState<FetchState>(
		tickets.length ? 'loaded' : 'loading',
	);

	// Feature scoped logger
	const log = useMemo(() => bindLogger('tickets'), []);

	// Mount log (один раз при инициализации экрана)
	useEffect(() => {
		log.info('mount');
	}, [log]);

	useEffect(() => {
		if (fetchState !== 'loading') return;
		let cancelled = false;
		log.info('fetch:start', { cachedCount: tickets.length });
		ticketApi
			.getMyTickets()
			.then(data => {
				if (!cancelled) setTickets(data);
				if (!cancelled) setFetchState('loaded');
				if (!cancelled)
					log.info('fetch:success', { count: data.length });
			})
			.catch(e => {
				if (!cancelled) {
					setFetchState('error');
					log.error('fetch:error', {
						message: e?.message || 'unknown',
					});
				}
			});
		return () => {
			cancelled = true;
		};
	}, [fetchState, setTickets, tickets.length, log]);

	const isLoading = fetchState === 'loading';
	const showEmpty = fetchState === 'loaded' && !tickets.length;

	return (
		<SafeAreaView style={styles.root}>
			<View style={styles.header}>
				<BackButton variant='icon' onPress={() => router.back()} />
				<AppText style={styles.headerTitle}>Избранное</AppText>
				<View style={styles.headerRightStub} />
			</View>

			{isLoading ? (
				<View style={styles.loadingWrap} testID='favourites-loading'>
					<ActivityIndicator
						size='large'
						color={Colors.greenPrimary}
					/>
				</View>
			) : fetchState === 'error' ? (
				<View style={styles.loadingWrap} testID='favourites-error'>
					<AppText style={styles.errorText}>
						Упс! Что-то пошло не так. Пожалуйста, попробуйте еще
						раз.
					</AppText>
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
	errorText: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
		marginBottom: 16,
		textAlign: 'center',
	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	headerRightStub: {
		height: Sizes.button.sm,
		width: Sizes.button.sm,
	},
	headerTitle: {
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
	},
	loadingWrap: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'flex-start',
		paddingTop: 80,
	},
	root: {
		backgroundColor: Colors.grayBackground,
		flex: 1,
		padding: 16,
	},
});

export default SavedRoutesPage;
