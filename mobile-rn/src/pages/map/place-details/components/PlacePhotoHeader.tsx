import fallbackImage from '@/assets/images/unmatched.png';
import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

import type { Place } from '../types';
import { PhotoCarousel } from './PhotoCarousel';

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
		return (
			place.photos?.map(p => p.url).filter(Boolean) ?? [
				heroSource.uri ?? '',
			]
		).filter(url => url);
	}, [place.photos, heroSource]);

	const photoCount = place.photos?.length ?? 0;

	return (
		<View style={styles.container}>
			{!isExpanded && photoUrls.length > 0 ? (
				<PhotoCarousel photos={photoUrls} />
			) : (
				<View style={styles.imageWrapper}>
					<Image
						source={heroSource}
						style={styles.heroImage}
						resizeMode='cover'
					/>

					<View style={styles.imageOverlay}>
						<View style={styles.photosBadge}>
							<AppText style={styles.photosBadgeText}>
								{photoCount > 0
									? `${photoCount} фото`
									: 'Нет фото'}
							</AppText>
						</View>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: -Radius.r24, // Фото заезжает под модальное окно
	},
	heroImage: {
		borderTopLeftRadius: Radius.r20,
		borderTopRightRadius: Radius.r20,
		height: 250,
		width: '100%',
	},
	imageOverlay: {
		bottom: Gaps.g32,
		left: Gaps.g16,
		position: 'absolute',
		right: Gaps.g16,
	},
	imageWrapper: {
		overflow: 'hidden',
		position: 'relative',
	},
	photosBadge: {
		alignSelf: 'flex-end',
		backgroundColor: Colors.modalOverlay,
		borderRadius: Radius.r12,
		paddingHorizontal: Gaps.g10,
		paddingVertical: 6,
	},
	photosBadgeText: {
		color: Colors.white,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f14,
	},
});
