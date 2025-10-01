import ArrowRightIcon from '@/assets/icons/ArrowRightIcon';
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

import { Route } from '@/pages/routes/model/routes';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText, LikeButton } from '@/shared/ui';
import { PaginationDots } from '@/shared/ui/PaginationDots';

const formatDate = (isoString: string): string => {
	const date = new Date(isoString);
	return date.toLocaleDateString('ru-RU');
};

interface Props {
	route: Route;
	onToggleFavorite: (routeId: string) => void;
}
const { width: screenWidth } = Dimensions.get('window');

export const RouteCard: React.FC<Props> = ({ route, onToggleFavorite }) => {
	const activeIndex = useSharedValue(0);

	return (
		<View style={styles.root}>
			<Carousel
				loop={false}
				width={screenWidth - 32}
				height={165}
				data={route.images}
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
				onPress={() => onToggleFavorite(route.id)}
				liked={!!route.isFavorite}
			/>
			<View style={styles.dotsContainer}>
				<PaginationDots
					totalCount={route.images.length}
					activeIndex={activeIndex}
				/>
			</View>
			<View style={styles.contentContainer}>
				<View style={styles.headerRow}>
					<View>
						<AppText style={styles.title}>{route.title}</AppText>
						<AppText style={styles.date}>
							{formatDate(route.date)}
						</AppText>
					</View>
					<View style={styles.statsContainer}>
						<AppText
							style={[
								styles.distance,
								{ color: Colors.greenPrimary },
							]}
						>
							{route.distance}
						</AppText>
						<AppText style={styles.duration}>
							{route.duration}
						</AppText>
					</View>
				</View>
				<View style={styles.routeContainer}>
					<AppText style={styles.routeText}>
						{'из ' + route.startPoint}
					</AppText>
					<ArrowRightIcon />
					<AppText style={styles.routeText}>
						{'в ' + route.endPoint}
					</AppText>
				</View>
				<View style={styles.tagsContainer}>
					{route.tags.map((tag, index) => (
						<View key={index} style={styles.tag}>
							<AppText style={styles.tagText}>
								{'#' + tag}
							</AppText>
						</View>
					))}
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	contentContainer: {
		padding: 16,
		paddingTop: 20,
	},
	date: {
		color: Colors.secondaryText,
		fontSize: Fonts.f14,
		marginTop: 4,
	},
	distance: {
		fontSize: Fonts.f14,
	},
	dotsContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		left: 0,
		position: 'absolute',
		right: 0,
		top: 161,
	},
	duration: {
		color: Colors.lightInputText,
		fontSize: Fonts.f14,
		marginTop: 8,
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
	statsContainer: {
		alignItems: 'flex-end',
	},
	tag: {
		backgroundColor: Colors.successGreen,
		borderRadius: Radius.r7,
		paddingHorizontal: 16,
		paddingVertical: 6,
	},
	tagText: {
		color: Colors.white,
		// fontSize: Fonts.f14,
	},
	tagsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 16,
	},
	title: {
		color: Colors.headerAndInputText,
		// fontFamily: Fonts.regular,
		fontSize: Fonts.f20,
	},
});
