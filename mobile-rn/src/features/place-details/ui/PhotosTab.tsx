// Вкладка с фотографиями и анимированной каруселью

import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

import { Colors, Gaps, Radius } from '@/shared/tokens';

import type { Place } from '../model/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_WIDTH = SCREEN_WIDTH - 32; // padding
const CAROUSEL_HEIGHT = 240;
const PROGRESS_BAR_COUNT = 6;
const AUTOPLAY_INTERVAL = 3000; // 3 секунды

interface PhotosTabProps {
	place: Place;
}

// Mock данные для демонстрации
const MOCK_PHOTOS = [
	'https://placehold.co/400x300/1FD975/white/png?text=Photo+1',
	'https://placehold.co/400x300/1CC4C4/white/png?text=Photo+2',
	'https://placehold.co/400x300/45CD86/white/png?text=Photo+3',
	'https://placehold.co/400x300/1EB18C/white/png?text=Photo+4',
	'https://placehold.co/400x300/027962/white/png?text=Photo+5',
	'https://placehold.co/400x300/3DEA90/white/png?text=Photo+6',
];

export function PhotosTab({ place }: PhotosTabProps) {
	const placePhotos = place.photos?.length
		? place.photos.map(p => p.url)
		: [];
	const photos = placePhotos.length > 0 ? placePhotos : MOCK_PHOTOS;
	const [currentIndex, setCurrentIndex] = useState(0);

	if (!photos || photos.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<View style={styles.emptyPlaceholder} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Carousel
				width={CAROUSEL_WIDTH}
				height={CAROUSEL_HEIGHT}
				data={photos}
				onSnapToItem={setCurrentIndex}
				autoPlay
				autoPlayInterval={AUTOPLAY_INTERVAL}
				renderItem={({ item }) => (
					<View style={styles.carouselItem}>
						<Image
							source={{ uri: item }}
							style={styles.image}
							resizeMode='cover'
						/>
					</View>
				)}
			/>

			<ProgressBars
				count={Math.min(PROGRESS_BAR_COUNT, photos.length)}
				currentIndex={currentIndex}
				autoPlayInterval={AUTOPLAY_INTERVAL}
			/>
		</View>
	);
}

interface ProgressBarsProps {
	count: number;
	currentIndex: number;
	autoPlayInterval: number;
}

function ProgressBars({
	count,
	currentIndex,
	autoPlayInterval,
}: ProgressBarsProps) {
	const progressValues = Array.from({ length: count }, () =>
		useSharedValue(0),
	);

	React.useEffect(() => {
		// Сбрасываем все прогрессы
		progressValues.forEach((progress, index) => {
			if (index < currentIndex) {
				progress.value = 1; // Заполнено
			} else if (index === currentIndex) {
				// Анимация текущего прогресса
				progress.value = 0;
				progress.value = withTiming(1, {
					duration: autoPlayInterval,
					easing: Easing.linear,
				});
			} else {
				progress.value = 0; // Пустой
			}
		});
	}, [currentIndex, autoPlayInterval]);

	return (
		<View style={styles.progressContainer}>
			{progressValues.map((progress, index) => (
				<ProgressBar key={index} progress={progress} />
			))}
		</View>
	);
}

interface ProgressBarProps {
	progress: Animated.SharedValue<number>;
}

function ProgressBar({ progress }: ProgressBarProps) {
	const animatedStyle = useAnimatedStyle(() => {
		return {
			width: `${progress.value * 100}%`,
		};
	});

	return (
		<View style={styles.progressBarContainer}>
			<Animated.View style={[styles.progressBarFill, animatedStyle]} />
		</View>
	);
}

const styles = StyleSheet.create({
	carouselItem: {
		borderRadius: Radius.r15,
		height: CAROUSEL_HEIGHT,
		overflow: 'hidden',
		width: CAROUSEL_WIDTH,
	},
	container: {
		paddingTop: Gaps.g16,
	},
	emptyContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: Gaps.g48,
	},
	emptyPlaceholder: {
		backgroundColor: Colors.lightBackground,
		borderRadius: Radius.r15,
		height: CAROUSEL_HEIGHT,
		width: CAROUSEL_WIDTH,
	},
	image: {
		height: '100%',
		width: '100%',
	},
	progressBarContainer: {
		backgroundColor: Colors.gray,
		borderRadius: Radius.r2,
		flex: 1,
		height: 3,
		overflow: 'hidden',
	},
	progressBarFill: {
		backgroundColor: Colors.greenPrimary,
		height: '100%',
	},
	progressContainer: {
		flexDirection: 'row',
		gap: Gaps.g4,
		marginTop: Gaps.g12,
	},
});
