import SendPlaceIcon from '@/assets/icons/SendPlaceIcon';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { ActionTouchable, AppButton, LikeButton } from '@/shared/ui';

import type { Place } from '../types';

interface PlaceActionsProps {
	place: Place;
	onBuildRoute?: (place: Place) => void;
	onToggleFavorite?: (place: Place, nextValue: boolean) => void;
	onShare?: (place: Place) => void;
}

export function PlaceActions({
	place,
	onBuildRoute,
	onToggleFavorite,
	onShare,
}: PlaceActionsProps) {
	const [isFavorite, setIsFavorite] = useState(false);

	const handleBuildRoute = useCallback(() => {
		if (onBuildRoute) {
			onBuildRoute(place);
		} else {
			console.log('Построить маршрут для места:', place.name);
		}
	}, [onBuildRoute, place]);

	const handleToggleFavorite = useCallback(() => {
		setIsFavorite(prev => {
			const nextValue = !prev;
			onToggleFavorite?.(place, nextValue);
			return nextValue;
		});
	}, [onToggleFavorite, place]);

	const handleShare = useCallback(() => {
		onShare?.(place);
	}, [onShare, place]);

	return (
		<View style={styles.container}>
			<AppButton
				text='Построить маршрут'
				onPress={handleBuildRoute}
				style={styles.routeButton}
				textFontSize={Fonts.f16}
				buttonBorderRadius={Radius.r16}
				textFontFamily={Fonts.medium}
				paddingHorizontal={24}
				paddingVertical={10}
			/>
			<View style={styles.secondaryActions}>
				<LikeButton
					onPress={handleToggleFavorite}
					liked={isFavorite}
					variant='large'
					style={styles.secondaryActionButton}
				/>
				<ActionTouchable
					onPress={handleShare}
					style={styles.secondaryActionButton}
				>
					<SendPlaceIcon />
				</ActionTouchable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		flexDirection: 'row',
		gap: Gaps.g16,
		paddingHorizontal: Gaps.g16,
		paddingVertical: Gaps.g12,
		width: '100%',
	},
	routeButton: {
		flex: 1,
		height: 44,
	},
	secondaryActionButton: {
		alignItems: 'center',
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r16,
		height: 44,
		justifyContent: 'center',
		width: 44,
	},
	secondaryActions: {
		flexDirection: 'row',
		gap: Gaps.g16,
	},
});
