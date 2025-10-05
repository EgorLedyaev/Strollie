// Компонент детальной информации о месте в Bottom Sheet

import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors, Gaps, Radius } from '@/shared/tokens';

import { usePlaceDetails } from '../state/placeDetailsStore';
import type { Place, TabType } from '../types';
import { OverviewTab } from './OverviewTab';
import { PhotosTab } from './PhotosTab';
import { PlaceSummary } from './PlaceSummary';
import { ReviewsTab } from './ReviewsTab';
import { TabSelector } from './TabSelector';

interface PlaceDetailsSheetProps {
	onDismiss?: () => void;
	onBuildRoute?: (place: Place) => void;
	onToggleFavorite?: (place: Place, nextValue: boolean) => void;
	onShare?: (place: Place) => void;
}

export function PlaceDetailsSheet({
	onDismiss,
	onBuildRoute,
	onToggleFavorite,
	onShare,
}: PlaceDetailsSheetProps) {
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const {
		selectedPlace,
		currentTab,
		setCurrentTab,
		isExpanded,
		setIsExpanded,
	} = usePlaceDetails();

	// Snap points для collapsed и expanded состояний
	const snapPoints = useMemo(() => ['40%', '90%'], []);

	// Убираем sheetIndex для BottomSheetModal - он управляется через present/dismiss
	const handleSheetChanges = useCallback(
		(index: number) => {
			const expanded = index === 1;
			setIsExpanded(expanded);

			const isClosed = index === -1;
			// Больше не скрываем навбар - sheet просто перекрывает его
			// onBottomNavBarVisibilityChange?.(isClosed);

			if (isClosed) {
				onDismiss?.();
			}
		},
		[setIsExpanded, onDismiss],
	);

	useEffect(() => {
		if (!bottomSheetRef.current) return;

		if (selectedPlace) {
			// Открываем модальное окно
			bottomSheetRef.current.present();
		} else {
			// Закрываем модальное окно
			bottomSheetRef.current.dismiss();
		}
	}, [selectedPlace]);

	const handleTabChange = useCallback(
		(tab: TabType) => {
			setCurrentTab(tab);
		},
		[setCurrentTab],
	);

	const handleSummaryTabChange = useCallback(
		(tab: TabType) => {
			setCurrentTab(tab);
			if (bottomSheetRef.current) {
				bottomSheetRef.current.snapToIndex(1);
			}
		},
		[setCurrentTab],
	);

	// Рендер контента вкладки
	const renderTabContent = () => {
		if (!selectedPlace) return null;

		switch (currentTab) {
			case 'overview':
				return <OverviewTab place={selectedPlace} />;
			case 'photos':
				return <PhotosTab place={selectedPlace} />;
			case 'reviews':
				return <ReviewsTab place={selectedPlace} />;
			default:
				return null;
		}
	};

	return (
		<BottomSheetModal
			ref={bottomSheetRef}
			snapPoints={snapPoints}
			onChange={handleSheetChanges}
			enablePanDownToClose
			handleIndicatorStyle={styles.indicator}
			backgroundStyle={styles.background}
		>
			<BottomSheetScrollView
				contentContainerStyle={styles.contentContainer}
				keyboardShouldPersistTaps='handled'
			>
				{selectedPlace && (
					<View style={styles.summaryWrapper}>
						<PlaceSummary
							place={selectedPlace}
							isExpanded={isExpanded}
							onOpenTab={handleSummaryTabChange}
							onBuildRoute={onBuildRoute}
							onToggleFavorite={onToggleFavorite}
							onShare={onShare}
						/>
					</View>
				)}

				{isExpanded && (
					<View style={styles.header}>
						<TabSelector
							currentTab={currentTab}
							onTabChange={handleTabChange}
							isExpanded={isExpanded}
						/>
					</View>
				)}

				{isExpanded && (
					<View style={styles.content}>{renderTabContent()}</View>
				)}
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}

const styles = StyleSheet.create({
	background: {
		backgroundColor: Colors.white,
		borderTopLeftRadius: Radius.r47,
		borderTopRightRadius: Radius.r47,
	},
	content: {
		flex: 1,
		paddingHorizontal: Gaps.g16,
	},
	contentContainer: {
		gap: Gaps.g16,
		paddingBottom: Gaps.g32,
	},
	header: {
		paddingHorizontal: Gaps.g16,
		paddingTop: Gaps.g16,
	},
	indicator: {
		backgroundColor: Colors.gray,
		height: 4,
		width: 40,
	},
	summaryWrapper: {
		paddingHorizontal: Gaps.g16,
		paddingTop: Gaps.g16,
	},
});
