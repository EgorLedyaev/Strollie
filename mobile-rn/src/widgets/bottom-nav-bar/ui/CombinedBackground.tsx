// src/widgets/bottom-nav-bar/ui/CombinedBackground.tsx
import {
	Canvas,
	Group,
	Paint,
	Path,
	RoundedRect,
	Shadow,
	Skia,
} from '@shopify/react-native-skia';
import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';

// Те самые константы из твоего компонента
const NAV_BAR_HEIGHT = 72;
const PANEL_HEIGHT = 140;
const GAP = 5; // Расстояние между панелью и навбаром
const TOTAL_UI_HEIGHT = NAV_BAR_HEIGHT + PANEL_HEIGHT + GAP;

// Это path из твоего SVG. Не трогай его.
const NAV_BAR_SVG_PATH =
	'M137.109 18H20C8.9543 18 0 26.9543 0 38V70C0 81.0457 8.9543 90 20 90H373C384.046 90 393 81.0457 393 70V38C393 26.9543 384.046 18 373 18H257.457C246.811 18 238.796 26.4003 237.436 36.959C235.242 54.0019 227.323 74.3774 196.841 74.3774C165.666 74.3774 158.38 53.8003 156.615 36.7736C155.526 26.2666 147.673 18 137.109 18Z';
const skiaNavBarPath = Skia.Path.MakeFromSVGString(NAV_BAR_SVG_PATH);
if (!skiaNavBarPath) {
	throw new Error('Could not create Skia path from SVG string.');
}

export const CombinedBackground: React.FC = () => {
	const { width } = useWindowDimensions();

	// SVG имеет свою ширину (393), нам нужно масштабировать его под ширину экрана
	const scaleX = width / 393;
	// Трансформация для навбара: масштабируем и сдвигаем вниз
	const navBarTransform = [{ scaleX }, { translateY: PANEL_HEIGHT + GAP }];

	return (
		<Canvas style={styles.canvas}>
			<Group color='white'>
				{/* Тень для всей группы, чтобы выглядело цельно */}
				<Paint>
					<Shadow
						dx={0}
						dy={-2}
						blur={4}
						color='rgba(0, 0, 0, 0.1)'
					/>
				</Paint>

				{/* 1. Панель (верхняя часть) */}
				<RoundedRect
					x={0}
					y={0}
					width={width}
					height={PANEL_HEIGHT}
					r={20}
				/>

				{/* 2. Заливка пространства (gap) */}
				<RoundedRect
					x={0}
					y={PANEL_HEIGHT}
					width={width}
					height={NAV_BAR_HEIGHT + GAP} // Рисуем прямоугольник под навбаром
					r={0} // Без скругления
				/>

				{/* 3. Форма навбара с вырезом */}
				<Group transform={navBarTransform}>
					<Path path={skiaNavBarPath} />
				</Group>
			</Group>
		</Canvas>
	);
};

const styles = StyleSheet.create({
	canvas: {
		...StyleSheet.absoluteFillObject,
	},
});
