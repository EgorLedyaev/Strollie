import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
	interpolate,
	useAnimatedStyle,
	useDerivedValue,
	withTiming,
	type SharedValue,
} from 'react-native-reanimated';

import { Colors, Radius } from '@/shared/tokens';

interface DotProps {
	index: number;
	activeIndex: SharedValue<number>;
	containerTranslateX: SharedValue<number>;
}

const Dot: React.FC<DotProps> = ({
	index,
	activeIndex,
	containerTranslateX,
}) => {
	const DOT_FULL_WIDTH = 10;

	const animatedStyle = useAnimatedStyle(() => {
		const distance = Math.abs(activeIndex.value - index);
		const size = interpolate(distance, [0, 1, 2], [14, 10, 6], 'clamp');

		const position = index * DOT_FULL_WIDTH + containerTranslateX.value;
		const visibilityRange = [
			-DOT_FULL_WIDTH,
			0,
			DOT_FULL_WIDTH * 4,
			DOT_FULL_WIDTH * 5,
		];
		const opacity = interpolate(
			position,
			visibilityRange,
			[0, 1, 1, 0],
			'clamp',
		);

		return {
			width: withTiming(size),
			height: withTiming(size),
			opacity: withTiming(opacity),
		};
	});

	return <Animated.View style={[styles.dot, animatedStyle]} />;
};

interface PaginationProps {
	totalCount: number;
	activeIndex: SharedValue<number>;
}

export const PaginationDots: React.FC<PaginationProps> = ({
	totalCount,
	activeIndex,
}) => {
	if (totalCount <= 1) return null;

	const DOT_FULL_WIDTH = 10;

	// Смещение контейнера
	const containerTranslateX = useDerivedValue(() => {
		// Если фото 5 или меньше, контейнер не двигается
		if (totalCount <= 5) return 0;

		const activeIdx = activeIndex.value;
		const lastImageIndex = totalCount - 1;
		let offsetInDots = 0;

		// Для первых 4 фото активный индикатор свободно движется, контейнер стоит на месте
		if (activeIdx < 3) {
			offsetInDots = 0;
		}
		// Залипание активного индикатора с 4 по предпоследнюю фото на предпоследней позиции
		// Сдвигаем контейнер, чтобы активная точка была 4-й
		else if (activeIdx >= 3 && activeIdx < lastImageIndex) {
			offsetInDots = activeIdx - 3;
		}
		// Последнее фото - активный индикатор сдвигается на 5 позицию
		else {
			offsetInDots = totalCount - 5;
		}

		return -offsetInDots * DOT_FULL_WIDTH;
	});

	// Анимированный стиль для применения сдвига
	const animatedContainerStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: withTiming(containerTranslateX.value) }],
		};
	});

	// точки просто бегают по экрану, контейнер не двигается
	if (totalCount <= 5) {
		const dummyTranslateX = useDerivedValue(() => 0);
		return (
			<View style={styles.container}>
				{Array.from({ length: totalCount }).map((_, index) => (
					<Dot
						key={index}
						index={index}
						activeIndex={activeIndex}
						containerTranslateX={dummyTranslateX}
					/>
				))}
			</View>
		);
	}

	return (
		<View style={styles.containerClipper}>
			<Animated.View style={[styles.container, animatedContainerStyle]}>
				{Array.from({ length: totalCount }).map((_, index) => (
					<Dot
						key={index}
						index={index}
						activeIndex={activeIndex}
						containerTranslateX={containerTranslateX}
					/>
				))}
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { alignItems: 'center', flexDirection: 'row' },
	containerClipper: {
		width: 64,
	},
	dot: {
		backgroundColor: Colors.successGreen,
		borderRadius: Radius.r8,
		height: 6,
		marginHorizontal: 2,
		width: 6,
	},
});
