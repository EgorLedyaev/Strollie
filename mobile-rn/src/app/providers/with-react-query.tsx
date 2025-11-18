import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import {
	focusManager,
	onlineManager,
	QueryClientProvider,
} from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import React, { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

import { createQueryClient } from '@/shared/api';

const asyncStoragePersister = createAsyncStoragePersister({
	storage: AsyncStorage,
});

const queryClient = createQueryClient();

export function ReactQueryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		onlineManager.setEventListener(setOnline => {
			const unsubscribe = NetInfo.addEventListener(state => {
				const isOnline = Boolean(
					state.isConnected && state.isInternetReachable,
				);
				setOnline(isOnline);
			});
			return unsubscribe;
		});

		const subscription = AppState.addEventListener('change', status => {
			focusManager.setFocused(status === 'active');
		});

		return () => {
			subscription.remove();
		};
	}, []);

	if (Platform.OS === 'web') {
		return (
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		);
	}

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{
				persister: asyncStoragePersister,
				maxAge: 24 * 60 * 60 * 1000,
			}}
		>
			{children}
		</PersistQueryClientProvider>
	);
}
