import DeleteIcon from '@/assets/icons/DeleteIcon';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import type { RouteGenerationResponse } from '@/entities/generated-route';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { ActionTouchable, AppText, EditButton, LikeButton } from '@/shared/ui';

const placeholderImage =
	'https://placehold.co/800x600/EDF2F7/9AA1B2?text=Strollie';

interface RouteResultProps {
	result: RouteGenerationResponse;
	onReset: () => void;
	onOpenDirections: () => void;
	onHidePlace: (id: string) => void;
	hiddenPlaceIds: Set<string>;
}

export const RouteResult: React.FC<RouteResultProps> = ({
	result,
	onReset,
	onOpenDirections,
	onHidePlace,
	hiddenPlaceIds,
}) => {
	const visiblePlaces = result.places.filter(
		place => !hiddenPlaceIds.has(place.id),
	);

	return (
		<View style={styles.resultContainer}>
			<View style={styles.resultHeader}>
				<AppText style={styles.resultTitle}>
					{result.description || 'Маршрут'}
				</AppText>
				<View style={styles.headerActions}>
					<EditButton
						onPress={onReset}
						size={34}
						borderRadius={Radius.r12}
						backgroundColor={Colors.grayBackground}
						iconColor={Colors.textAAA}
					/>
					<LikeButton
						liked={false}
						variant='small'
						size={34}
						backgroundColor={Colors.grayBackground}
						borderRadius={Radius.r12}
						onPress={onOpenDirections}
					/>
				</View>
			</View>

			{visiblePlaces.length ? (
				<View style={styles.resultPlaces}>
					{visiblePlaces.map((place, index) => (
						<View
							key={place.id || `${place.name}-${index}`}
							style={styles.placeCard}
						>
							<Image
								source={{
									uri: place.photoUrl || placeholderImage,
								}}
								style={styles.placeImage}
								resizeMode='cover'
							/>
							{place.rating && (
								<View style={styles.placeBadges}>
									<View style={styles.placeBadge}>
										<AppText style={styles.placeBadgeText}>
											{place.rating}
										</AppText>
									</View>
								</View>
							)}
							<View style={styles.placeOverlay}>
								<AppText style={styles.placeTitleOverlay}>
									{index + 1}. {place.name}
								</AppText>
								<AppText style={styles.placeCategoryOverlay}>
									{place.category}
								</AppText>
								{place.address ? (
									<AppText style={styles.placeAddressOverlay}>
										{place.address}
									</AppText>
								) : null}
							</View>
							<ActionTouchable
								style={styles.closeButton}
								onPress={() => onHidePlace(place.id)}
								hitSlop={8}
							>
								<View style={styles.deleteButtonIconContainer}>
									<DeleteIcon />
								</View>
							</ActionTouchable>
						</View>
					))}
				</View>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	closeButton: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r5,
		height: 24,
		justifyContent: 'center',
		paddingHorizontal: 6,
		position: 'absolute',
		right: 8,
		top: 8,
		width: 24,
	},
	deleteButtonIconContainer: {
		alignItems: 'center',
		height: 16,
		justifyContent: 'center',
		width: 16,
	},
	headerActions: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 8,
	},
	placeAddressOverlay: {
		color: Colors.white,
		fontSize: Fonts.f14,
		opacity: 0.9,
	},
	placeBadge: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r8,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	placeBadgeText: {
		color: Colors.grayTextOverlay,
		fontSize: Fonts.f12,
	},
	placeBadges: {
		flexDirection: 'row',
		gap: 8,
		left: 10,
		position: 'absolute',
		top: 10,
	},
	placeCard: {
		backgroundColor: Colors.grayBackground,
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r16,
		borderWidth: 1,
		overflow: 'hidden',
		position: 'relative',
	},
	placeCategoryOverlay: {
		color: Colors.white,
		fontSize: Fonts.f14,
	},
	placeImage: {
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r12,
		height: 120,
		width: '100%',
	},
	placeOverlay: {
		backgroundColor: Colors.darkImageOverlay,
		bottom: 0,
		gap: 2,
		left: 0,
		paddingHorizontal: 12,
		paddingVertical: 8,
		position: 'absolute',
		right: 0,
	},
	placeTitleOverlay: {
		color: Colors.white,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
	},
	resultContainer: {
		gap: 12,
		paddingHorizontal: 16,
		paddingTop: 12,
	},
	resultHeader: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 12,
		justifyContent: 'space-between',
	},
	resultPlaces: {
		gap: 10,
	},
	resultTitle: {
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
	},
});
