import {
	Canvas,
	Path,
	PathOp,
	processTransform2d,
	Shadow,
	Skia,
} from '@shopify/react-native-skia';
import * as React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';

// --- КОНСТАНТЫ ---
const CUTOUT_WIDTH = 120.348;
export const BAR_HEIGHT = 72;
const CORNER_RADIUS = 20;

// Параметры тени
const SHADOW_OFFSET_Y = 1;
const SHADOW_BLUR = 3;
const SHADOW_COLOR = 'rgba(0,0,0,0.2)';

// Вычисляем вертикальный отступ, чтобы тень не обрезалась.
// Нужен отступ сверху для верхнего размытия и снизу для смещения + нижнего размытия.
// Возьмем максимальное значение для простоты и добавим небольшой запас.
export const VERTICAL_PADDING = SHADOW_BLUR * 5 + Math.abs(SHADOW_OFFSET_Y);

// Новая общая высота контейнера
const TOTAL_HEIGHT = BAR_HEIGHT + VERTICAL_PADDING;

const CUTOUT_CURVE_COMMANDS =
	'C 109.702,0 101.687,8.4003 100.327,18.959 ' +
	'C 98.133,36.0019 90.214,56.3774 59.732,56.3774 ' +
	'C 28.557,56.3774 21.271,35.8003 19.506,18.7736 ' +
	'C 18.417,8.2666 10.564,0 0,0';

const CUTOUT_SHAPE_PATH_COMMANDS = `M ${CUTOUT_WIDTH},0 ${CUTOUT_CURVE_COMMANDS} L 0,0 Z`;

export const BottomNavBarWithCutout = () => {
	const { width } = useWindowDimensions();

	const finalPath = useDerivedValue(() => {
		// --- Все пути создаются относительно y=0 ---

		const mainPath = Skia.Path.Make();
		mainPath.addRRect(
			Skia.RRectXY(
				Skia.XYWHRect(0, 0, width, BAR_HEIGHT),
				CORNER_RADIUS,
				CORNER_RADIUS,
			),
		);

		const cutoutPath = Skia.Path.MakeFromSVGString(
			CUTOUT_SHAPE_PATH_COMMANDS,
		);

		if (!cutoutPath) {
			console.warn('Skia cutout path could not be created.');
			return mainPath;
		}

		const cutoutX = (width - CUTOUT_WIDTH) / 2;
		cutoutPath.transform(processTransform2d([{ translateX: cutoutX }]));

		const combinedPath = Skia.Path.MakeFromOp(
			mainPath,
			cutoutPath,
			PathOp.Difference,
		);

		// --- А вот здесь мы смещаем ИТОГОВУЮ фигуру вниз, чтобы освободить место для тени СВЕРХУ ---
		if (combinedPath) {
			combinedPath.transform(
				processTransform2d([{ translateY: VERTICAL_PADDING / 2 }]),
			);
		}

		return combinedPath ?? mainPath;
	}, [width]);

	return (
		// Контейнер теперь выше, чтобы вместить тень
		<View style={[styles.container, { width }]}>
			<Canvas style={styles.canvas}>
				<Path path={finalPath} color='white'>
					<Shadow
						dx={0}
						dy={SHADOW_OFFSET_Y}
						blur={SHADOW_BLUR}
						color={SHADOW_COLOR}
					/>
				</Path>
			</Canvas>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		// Высота теперь учитывает отступ для тени
		height: TOTAL_HEIGHT,
	},
	canvas: {
		flex: 1,
	},
});
