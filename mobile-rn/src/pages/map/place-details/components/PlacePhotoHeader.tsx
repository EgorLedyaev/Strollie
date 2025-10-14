import StarIcon from '@/assets/icons/StarIcon';
import fallbackImage from '@/assets/images/unmatched.png';
import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

import type { Place } from '../types';
import { PhotoCarousel } from './PhotoCarousel';

const PHOTO_HEIGHT = 212;

interface PlacePhotoHeaderProps {
	place: Place;
	isExpanded: boolean;
}

export function PlacePhotoHeader({ place, isExpanded }: PlacePhotoHeaderProps) {
	const heroSource = useMemo(() => {
		const firstPhoto = place.photos?.[0]?.url;
		if (firstPhoto) {
			return { uri: firstPhoto } satisfies { uri: string };
		}
		return fallbackImage;
	}, [place.photos]);

	const photoUrls = useMemo(() => {
		return place.photos?.map(photo => photo.url).filter(Boolean) ?? [];
	}, [place.photos]);

	const averageRating = place.review_stats?.average_rating ?? null;
	const addressLine = place.address?.full_name ?? place.address?.name ?? '';
	const distanceLabel = place.distance ?? '';
	const shouldRenderCarousel = !isExpanded && photoUrls.length > 0;
	const hasRating = averageRating !== null;

	return (
		<View style={styles.container}>
			<View style={styles.mediaWrapper}>
				{shouldRenderCarousel ? (
					<PhotoCarousel photos={photoUrls} />
				) : (
					<Image
						source={heroSource}
						style={styles.heroImage}
						resizeMode='cover'
					/>
				)}

				{!isExpanded && hasRating && (
					<View style={styles.ratingBadge}>
						<StarIcon />
						<AppText style={styles.ratingValue}>
							{averageRating?.toFixed(1)}
						</AppText>
					</View>
				)}

				{!isExpanded && (
					<View style={styles.bottomOverlay}>
						<View style={styles.captionBlock}>
							<AppText style={styles.placeName} numberOfLines={1}>
								{place.name}
							</AppText>
							{!!place.type && (
								<AppText
									style={styles.placeType}
									numberOfLines={1}
								>
									{place.type}
								</AppText>
							)}
							{!!addressLine && (
								<AppText
									style={styles.placeAddress}
									numberOfLines={1}
								>
									{addressLine}
								</AppText>
							)}
						</View>

						{!!distanceLabel && (
							<AppText
								style={styles.distanceText}
								numberOfLines={1}
							>
								{distanceLabel}
							</AppText>
						)}
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	bottomOverlay: {
		alignItems: 'flex-end',
		bottom: 32,
		flexDirection: 'row',
		justifyContent: 'space-between',
		left: Gaps.g16,
		position: 'absolute',
		right: Gaps.g16,
		zIndex: 2,
	},
	captionBlock: {
		gap: Gaps.g4,
		maxWidth: '68%',
	},
	container: {
		marginBottom: -Radius.r24,
	},
	distanceText: {
		color: Colors.white,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f12,
		textAlign: 'right',
	},
	heroImage: {
		height: PHOTO_HEIGHT,
		width: '100%',
	},
	mediaWrapper: {
		borderTopLeftRadius: Radius.r24,
		borderTopRightRadius: Radius.r24,
		height: PHOTO_HEIGHT,
		overflow: 'hidden',
		position: 'relative',
	},
	placeAddress: {
		color: Colors.white,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	placeName: {
		color: Colors.white,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f24,
	},
	placeType: {
		color: Colors.white,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
	},
	ratingBadge: {
		alignItems: 'center',
		backgroundColor: Colors.greenAccent,
		borderRadius: Radius.r8,
		flexDirection: 'row',
		gap: Gaps.g6,
		paddingHorizontal: 10,
		paddingVertical: 6,
		position: 'absolute',
		right: Gaps.g16,
		top: Gaps.g20,
		zIndex: 2,
	},
	ratingValue: {
		color: Colors.white,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f14,
	},
});
