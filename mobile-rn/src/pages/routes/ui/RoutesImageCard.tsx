import React, { useMemo, type ReactNode } from 'react';
import {
	Dimensions,
	Image,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
	type ImageSourcePropType,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

import { Colors, Radius } from '@/shared/tokens';
import { LikeButton, PaginationDots } from '@/shared/ui';

type LikeVariant = 'small' | 'large';

interface RoutesImageCardProps {
	images: ImageSourcePropType[];
	isFavorite?: boolean;
	onToggleFavorite?: () => void;
	children: ReactNode;
	likeButtonVariant?: LikeVariant;
	likeButtonStyle?: StyleProp<ViewStyle>;
	contentStyle?: StyleProp<ViewStyle>;
	containerStyle?: StyleProp<ViewStyle>;
	showPagination?: boolean;
	height?: number;
	width?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export const RoutesImageCard: React.FC<RoutesImageCardProps> = ({
	images,
	isFavorite,
	onToggleFavorite,
	children,
	likeButtonVariant = 'small',
	likeButtonStyle,
	contentStyle,
	containerStyle,
	showPagination = true,
	height = 165,
	width,
}) => {
	const activeIndex = useSharedValue(0);

	const cardWidth = useMemo(() => width ?? screenWidth - 32, [width]);

	return (
		<View style={[styles.root, containerStyle]}>
			<Carousel
				loop={false}
				width={cardWidth}
				height={height}
				data={images}
				scrollAnimationDuration={500}
				onSnapToItem={index => {
					activeIndex.value = index;
				}}
				renderItem={({ item }) => (
					<Image
						source={item}
						style={[styles.image, { height }]}
						resizeMode='cover'
					/>
				)}
			/>

			<LikeButton
				onPress={onToggleFavorite}
				liked={!!isFavorite}
				variant={likeButtonVariant}
				style={[styles.likeButton, likeButtonStyle]}
			/>

			{showPagination && (
				<View style={styles.dotsContainer}>
					<PaginationDots
						totalCount={images.length}
						activeIndex={activeIndex}
					/>
				</View>
			)}

			<View style={[styles.contentContainer, contentStyle]}>
				{children}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
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
	image: {
		borderTopLeftRadius: Radius.r15,
		borderTopRightRadius: Radius.r15,
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
});
