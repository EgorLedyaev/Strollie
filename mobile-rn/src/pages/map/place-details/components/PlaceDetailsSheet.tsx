// Компонент детальной информации о месте в Bottom Sheet

import {
	BottomSheetFooter,
	BottomSheetModal,
	BottomSheetScrollView,
	type BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Gaps, Radius } from '@/shared/tokens';

import { usePlaceDetails } from '../state/placeDetailsStore';
import type { Place, TabType } from '../types';
import { OverviewTab } from './OverviewTab';
import { PhotosTab } from './PhotosTab';
import { PlaceActions } from './PlaceActions';
import { PlacePhotoHeader } from './PlacePhotoHeader';
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
	const insets = useSafeAreaInsets();
	const {
		selectedPlace,
		currentTab,
		setCurrentTab,
		isExpanded,
		setIsExpanded,
		userHasReviewed,
		setUserHasReviewed,
		isReviewFormVisible,
		setIsReviewFormVisible,
	} = usePlaceDetails();

	// Snap points для collapsed и expanded состояний
	const snapPoints = useMemo(() => ['40%', '90%'], []);
	const actionsBottomPadding = useMemo(() => {
		return insets.bottom > 0 ? insets.bottom + Gaps.g12 : Gaps.g16;
	}, [insets.bottom]);

	const scrollBottomPadding = useMemo(() => {
		const ESTIMATED_ACTIONS_HEIGHT = 88;
		return ESTIMATED_ACTIONS_HEIGHT + actionsBottomPadding;
	}, [actionsBottomPadding]);

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
				return (
					<ReviewsTab
						place={selectedPlace}
						userHasReviewed={userHasReviewed}
						setUserHasReviewed={setUserHasReviewed}
						isReviewFormVisible={isReviewFormVisible}
						setIsReviewFormVisible={setIsReviewFormVisible}
					/>
				);
			default:
				return null;
		}
	};

	// Кастомный handle с фотографией
	const renderHandle = useCallback(() => {
		if (!selectedPlace) return null;

		return (
			<View style={styles.handleWrapper}>
				<PlacePhotoHeader
					place={selectedPlace}
					isExpanded={isExpanded}
				/>
				<View style={styles.indicatorWrapper}>
					<View style={styles.indicator} />
				</View>
			</View>
		);
	}, [selectedPlace, isExpanded]);

	const renderFooter = useCallback(
		(props: BottomSheetFooterProps) => {
			if (!selectedPlace) {
				return null;
			}

			return (
				<BottomSheetFooter {...props} bottomInset={0}>
					<View
						style={[
							styles.actionsWrapper,
							{ paddingBottom: actionsBottomPadding },
						]}
						testID='place-actions-wrapper'
					>
						<PlaceActions
							place={selectedPlace}
							onBuildRoute={onBuildRoute}
							onToggleFavorite={onToggleFavorite}
							onShare={onShare}
						/>
					</View>
				</BottomSheetFooter>
			);
		},
		[
			selectedPlace,
			onBuildRoute,
			onToggleFavorite,
			onShare,
			actionsBottomPadding,
		],
	);

	return (
		<BottomSheetModal
			ref={bottomSheetRef}
			snapPoints={snapPoints}
			onChange={handleSheetChanges}
			enablePanDownToClose
			handleComponent={renderHandle}
			backgroundStyle={
				isExpanded
					? styles.backgroundExpanded
					: styles.backgroundCollapsed
			}
			footerComponent={renderFooter}
		>
			<View style={styles.modalContent}>
				<BottomSheetScrollView
					contentContainerStyle={[
						styles.contentContainer,
						{ paddingBottom: scrollBottomPadding },
					]}
					keyboardShouldPersistTaps='handled'
					style={styles.scrollView}
				>
					<View style={styles.whiteBackground}>
						{selectedPlace && isExpanded && (
							<View style={styles.summaryWrapper}>
								<PlaceSummary
									place={selectedPlace}
									isExpanded={isExpanded}
									onOpenTab={handleSummaryTabChange}
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
							<View style={styles.content}>
								{renderTabContent()}
							</View>
						)}
					</View>
				</BottomSheetScrollView>
			</View>
		</BottomSheetModal>
	);
}

const styles = StyleSheet.create({
	actionsWrapper: {
		backgroundColor: Colors.white,
		borderTopLeftRadius: Radius.r24,
		borderTopRightRadius: Radius.r24,
		paddingHorizontal: Gaps.g16,
		paddingTop: Gaps.g16,
	},
	backgroundCollapsed: {
		backgroundColor: Colors.white,
		borderTopLeftRadius: Radius.r24,
		borderTopRightRadius: Radius.r24,
	},
	backgroundExpanded: {
		backgroundColor: Colors.white,
		borderTopLeftRadius: Radius.r24,
		borderTopRightRadius: Radius.r24,
	},
	content: {
		flex: 1,
		paddingHorizontal: Gaps.g16,
	},
	contentContainer: {
		gap: Gaps.g16,
	},
	handleWrapper: {
		backgroundColor: Colors.transparent, // Полностью прозрачный фон для handle
	},
	header: {
		paddingHorizontal: Gaps.g16,
		paddingTop: Gaps.g16,
	},
	indicator: {
		alignSelf: 'center',
		backgroundColor: Colors.gray,
		borderRadius: Radius.r2,
		height: 4,
		width: 40,
	},
	indicatorWrapper: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderTopLeftRadius: Radius.r24,
		borderTopRightRadius: Radius.r24,
		paddingBottom: Gaps.g16, // Добавляем отступ снизу
		paddingTop: Gaps.g12,
	},
	modalContent: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	summaryWrapper: {
		backgroundColor: Colors.white, // Белый фон для контента
		paddingHorizontal: Gaps.g16,
		paddingTop: Gaps.g16,
	},
	whiteBackground: {
		backgroundColor: Colors.white,
		flex: 1,
	},
});
