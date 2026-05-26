import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppButton, AppText, BackButton } from '@/shared/ui';

import { AiMode } from './AiMode';
import { RouteResult } from './components/RouteResult';
import { useRoutePlanner } from './useRoutePlanner';

interface RoutePlannerProps {
	isVisible: boolean;
	onClose: () => void;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
	isVisible,
	onClose,
}) => {
	const { bottom, top } = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const {
		startPointText,
		startPointError,
		locationError,
		orderedCategories,
		selectedCategories,
		hours,
		minutes,
		comment,
		routeResult,
		canOpenDirections,
		hiddenPlaceIds,
		isCategoriesLoading,
		isGenerating,
		isGeocoding,
		isOpeningExternal,
		handleStartPointChange,
		handleClearStartPoint,
		setHours,
		setMinutes,
		setComment,
		resetResult,
		applyMyLocation,
		geocodeOnBlur,
		toggleCategory,
		handleHidePlace,
		handleSubmit,
		handleOpenDirections,
	} = useRoutePlanner({ isVisible });

	const snapPoints = useMemo(
		() => (routeResult ? ['62%'] : ['92%']),
		[routeResult],
	);

	const hasError = Boolean(startPointError || locationError);

	useEffect(() => {
		if (!sheetRef.current) return;
		if (isVisible) {
			sheetRef.current.present();
			sheetRef.current.snapToIndex(0);
		} else {
			sheetRef.current.dismiss();
		}
	}, [isVisible]);

	return (
		<BottomSheetModal
			ref={sheetRef}
			snapPoints={snapPoints}
			index={0}
			onChange={index => {
				if (index === -1) onClose();
			}}
			enablePanDownToClose
			handleIndicatorStyle={styles.handleIndicator}
			backgroundStyle={styles.sheetBackground}
		>
			<View
				style={[
					styles.sheetContainer,
					{ paddingBottom: bottom || 12, paddingTop: top + 12 },
				]}
			>
				<BottomSheetScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContent}
				>
					{routeResult ? (
						<RouteResult
							result={routeResult}
							onReset={resetResult}
							onOpenDirections={handleOpenDirections}
							onHidePlace={handleHidePlace}
							hiddenPlaceIds={hiddenPlaceIds}
						/>
					) : (
						<AiMode
							startPoint={startPointText}
							onStartPointChange={handleStartPointChange}
							onStartPointBlur={() => void geocodeOnBlur()}
							onUseMyLocation={applyMyLocation}
							onClearStartPoint={handleClearStartPoint}
							isGeocoding={isGeocoding}
							startPointError={startPointError || locationError}
							categories={orderedCategories}
							selectedCategories={selectedCategories}
							onToggleCategory={toggleCategory}
							hours={hours}
							onHoursChange={setHours}
							minutes={minutes}
							onMinutesChange={setMinutes}
							comment={comment}
							onCommentChange={setComment}
							isCategoriesLoading={isCategoriesLoading}
						/>
					)}
					{hasError && (
						<AppText style={styles.errorText}>
							{startPointError ||
								'Не удалось построить маршрут. Попробуйте позже.'}
						</AppText>
					)}
				</BottomSheetScrollView>

				<View style={styles.footer}>
					<BackButton
						variant='icon'
						onPress={routeResult ? resetResult : onClose}
						style={styles.backButton}
					/>
					{routeResult ? (
						<AppButton
							text='Открыть в картах'
							onPress={handleOpenDirections}
							isLoading={isOpeningExternal}
							disabled={!canOpenDirections}
							style={styles.buildButton}
							textFontFamily={Fonts.bold}
						/>
					) : (
						<AppButton
							text={'Построить'}
							onPress={handleSubmit}
							isLoading={isGenerating || isGeocoding}
							disabled={isCategoriesLoading}
							style={styles.buildButton}
							textFontFamily={Fonts.bold}
						/>
					)}
				</View>
			</View>
		</BottomSheetModal>
	);
};

const styles = StyleSheet.create({
	backButton: {
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r16,
		height: 52,
		width: 52,
	},
	buildButton: {
		alignItems: 'center',
		borderRadius: Radius.r16,
		flex: 1,
		height: 52,
	},
	errorText: {
		color: Colors.error,
		fontSize: Fonts.f14,
		marginTop: 12,
		paddingHorizontal: 16,
	},
	footer: {
		alignItems: 'center',
		borderTopColor: Colors.grayBackground,
		borderTopWidth: 1,
		flexDirection: 'row',
		gap: 16,
		paddingBottom: 18,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	handleIndicator: {
		backgroundColor: Colors.gray,
		borderRadius: Radius.r4,
		height: 4,
		width: 42,
	},
	scrollContent: {
		paddingBottom: 16,
	},
	sheetBackground: {
		backgroundColor: Colors.white,
		borderTopLeftRadius: Radius.r20,
		borderTopRightRadius: Radius.r20,
	},
	sheetContainer: {
		flex: 1,
		paddingHorizontal: 16,
	},
});
