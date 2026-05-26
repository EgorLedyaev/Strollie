// Карусель с фото и автоматическим прогресс-баром

import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	Image,
	LayoutChangeEvent,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import Animated, {
	runOnUI,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
	type SharedValue,
} from 'react-native-reanimated';

import { Colors, Radius } from '@/shared/tokens';

const CAROUSEL_HEIGHT = 212; // Высота фотоблока из макета
const PROGRESS_DURATION = 5000; // 5 секунд на фото
const PROGRESS_BAR_HEIGHT = 3;
const PROGRESS_BAR_GAP = 8;

interface PhotoCarouselProps {
	photos: string[];
	onClose?: () => void;
}

export function PhotoCarousel({ photos, onClose }: PhotoCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const progressValues = useRef<SharedValue<number>[]>(
		photos.map(() => useSharedValue(0)),
	).current;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const timerRef = useRef<any>(null);

	// Запуск прогресса для текущего фото
	const startProgress = useCallback(
		(index: number) => {
			// Выполняем операции с SharedValue в UI-потоке
			runOnUI((idx: number, values: SharedValue<number>[]) => {
				'worklet';
				// Устанавливаем завершённые прогрессы в 1
				for (let i = 0; i < idx; i++) {
					values[i].value = 1;
				}
				// Сбрасываем прогрессы после текущего
				for (let i = idx + 1; i < values.length; i++) {
					values[i].value = 0;
				}
				// Анимируем текущий прогресс
				values[idx].value = withTiming(1, {
					duration: PROGRESS_DURATION,
				});
			})(index, progressValues);
		},
		[progressValues],
	);

	// Эффект для запуска прогресса при изменении индекса
	useEffect(() => {
		startProgress(currentIndex);

		// Таймер для переключения на следующее фото
		timerRef.current = setTimeout(() => {
			if (currentIndex < photos.length - 1) {
				setCurrentIndex(currentIndex + 1);
			}
		}, PROGRESS_DURATION);

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [currentIndex, startProgress, photos.length]);

	// Обработчик клика для переключения фото
	const handlePress = useCallback(
		(side: 'left' | 'right') => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}

			if (side === 'left' && currentIndex > 0) {
				setCurrentIndex(currentIndex - 1);
			} else if (side === 'right' && currentIndex < photos.length - 1) {
				setCurrentIndex(currentIndex + 1);
			}
		},
		[currentIndex, photos.length],
	);

	return (
		<View style={styles.container}>
			{/* Фоновое изображение */}
			<Image
				source={{ uri: photos[currentIndex] }}
				style={styles.image}
				resizeMode='cover'
			/>

			<LinearGradient
				pointerEvents='none'
				colors={['rgba(0,0,0,0.45)', 'transparent', 'rgba(0,0,0,0.9)']}
				locations={[0, 0.35, 1]}
				style={styles.gradientOverlay}
			/>

			{/* Прогресс-бары */}
			<View style={styles.progressContainer}>
				{photos.map((_, index) => (
					<ProgressBar key={index} progress={progressValues[index]} />
				))}
			</View>

			{/* Кнопка закрытия */}
			<TouchableOpacity style={styles.closeButton} onPress={onClose}>
				<View style={styles.closeIconLine1} />
				<View style={styles.closeIconLine2} />
			</TouchableOpacity>

			{/* Невидимые зоны для переключения */}
			<TouchableOpacity
				style={[styles.touchZone, styles.touchZoneLeft]}
				onPress={() => handlePress('left')}
				activeOpacity={1}
			/>
			<TouchableOpacity
				style={[styles.touchZone, styles.touchZoneRight]}
				onPress={() => handlePress('right')}
				activeOpacity={1}
			/>
		</View>
	);
}

interface ProgressBarProps {
	progress: SharedValue<number>;
}

function ProgressBar({ progress }: ProgressBarProps) {
	const containerWidth = useSharedValue(0);

	const handleLayout = useCallback(
		(event: LayoutChangeEvent) => {
			containerWidth.value = event.nativeEvent.layout.width;
		},
		[containerWidth],
	);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			width: containerWidth.value * progress.value,
		};
	});

	return (
		<View style={styles.progressBarBackground} onLayout={handleLayout}>
			<Animated.View style={[styles.progressBarFill, animatedStyle]} />
		</View>
	);
}

const styles = StyleSheet.create({
	closeButton: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r20,
		height: 32,
		justifyContent: 'center',
		position: 'absolute',
		right: 16,
		top: 16,
		width: 32,
		zIndex: 10,
	},
	closeIconLine1: {
		backgroundColor: Colors.black,
		height: 2,
		position: 'absolute',
		transform: [{ rotate: '45deg' }],
		width: 16,
	},
	closeIconLine2: {
		backgroundColor: Colors.black,
		height: 2,
		position: 'absolute',
		transform: [{ rotate: '-45deg' }],
		width: 16,
	},
	container: {
		height: CAROUSEL_HEIGHT,
		position: 'relative',
		width: '100%',
	},
	gradientOverlay: {
		...StyleSheet.absoluteFillObject,
		zIndex: 1,
	},
	image: {
		height: '100%',
		width: '100%',
	},
	progressBarBackground: {
		backgroundColor: Colors.progressBarInactive,
		borderRadius: PROGRESS_BAR_HEIGHT / 2,
		flex: 1,
		height: PROGRESS_BAR_HEIGHT,
		overflow: 'hidden',
	},
	progressBarFill: {
		backgroundColor: Colors.white,
		borderRadius: PROGRESS_BAR_HEIGHT / 2,
		height: '100%',
	},
	progressContainer: {
		flexDirection: 'row',
		gap: PROGRESS_BAR_GAP,
		left: 16,
		position: 'absolute',
		right: 16,
		top: CAROUSEL_HEIGHT - 42,
		zIndex: 5,
	},
	touchZone: {
		height: '100%',
		position: 'absolute',
		top: 0,
		width: '50%',
	},
	touchZoneLeft: {
		left: 0,
	},
	touchZoneRight: {
		right: 0,
	},
});
