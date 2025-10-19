import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

import { Place } from '@/pages/routes/model/places';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText, LikeButton, PaginationDots } from '@/shared/ui';

interface Props {
	place: Place;
	onToggleFavorite: (placeId: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const PlaceCard: React.FC<Props> = ({ place, onToggleFavorite }) => {
	const activeIndex = useSharedValue(0);

	return (
		<View style={styles.root}>
			<Carousel
				loop={false}
				width={screenWidth - 32}
				height={165}
				data={place.images}
				scrollAnimationDuration={500}
				onSnapToItem={index => {
					activeIndex.value = index;
				}}
				renderItem={({ item }) => (
					<Image
						source={item}
						style={styles.image}
						resizeMode='cover'
					/>
				)}
			/>
			<LikeButton
				onPress={() => onToggleFavorite(place.id)}
				liked={!!place.isFavorite}
				style={styles.likeButton}
			/>
			<View style={styles.dotsContainer}>
				<PaginationDots
					totalCount={place.images.length}
					activeIndex={activeIndex}
				/>
			</View>
			<View style={styles.contentContainer}>
				<View style={styles.headerRow}>
					<View>
						<AppText style={styles.title}>{place.title}</AppText>
						<AppText style={styles.category}>
							{place.category}
						</AppText>
					</View>
				</View>
				<View style={styles.routeContainer}>
					<AppText style={styles.routeText}>{place.address}</AppText>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	category: {
		color: Colors.secondaryText,
		fontSize: Fonts.f14,
		marginTop: 4,
	},
	contentContainer: {
		padding: 16,
		paddingTop: 20,
	},
	dotsContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		left: 0,
		position: 'absolute',
		right: 0,
		top: 161,
	},
	headerRow: {
		alignItems: 'flex-start',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	image: {
		borderTopLeftRadius: Radius.r15,
		borderTopRightRadius: Radius.r15,
		height: 165,
		width: '100%',
	},

	likeButton: {
		left: 19,
		position: 'absolute',
		top: 21,
	},
	root: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		marginBottom: 16,
		width: '100%',
	},
	routeContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 8,
		marginBottom: 20,
	},
	routeText: {
		color: Colors.secondaryText,
		fontSize: Fonts.f14,
	},
	title: {
		color: Colors.headerAndInputText,
		// fontFamily: Fonts.regular,
		fontSize: Fonts.f20,
	},
});
