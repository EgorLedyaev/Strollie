import LikeIcon from '@/assets/icons/LikeIcon';
import ShareIcon from '@/assets/icons/ShareIcon';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppButton, IconButton } from '@/shared/ui';

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
				<IconButton
					onPress={handleToggleFavorite}
					style={styles.secondaryActionButton}
				>
					{() => (
						<LikeIcon
							color={
								isFavorite
									? Colors.likeActive
									: Colors.likeInactive
							}
						/>
					)}
				</IconButton>
				<IconButton
					onPress={handleShare}
					style={styles.secondaryActionButton}
				>
					{() => <ShareIcon color={Colors.greenIconDark} />}
				</IconButton>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderTopLeftRadius: Radius.r16,
		borderTopRightRadius: Radius.r16,
		flexDirection: 'row',
		gap: Gaps.g16,
		paddingBottom: 35,
		paddingHorizontal: Gaps.g32,
		paddingTop: 26,
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
