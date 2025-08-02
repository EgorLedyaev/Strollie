import * as React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, Mask, Path, Rect, SvgProps } from 'react-native-svg';

// --- КОНСТАНТЫ ИЗ ОРИГИНАЛЬНОГО SVG ---
// Ширина выреза в пикселях. Не трогай.
const CUTOUT_WIDTH = 120.348;
// Высота самого бара. Можешь поменять, если нужно.
const BAR_HEIGHT = 72;
// Вертикальная позиция "линии" бара, откуда начинается вырез.
const BAR_TOP_Y = 0;
// Радиус скругления для нижних углов.
const CORNER_RADIUS = 20;

// Это данные для кривой выреза, нормализованные для использования в маске.
// Они рисуют кривую от правого края к левому.
const CUTOUT_CURVE_COMMANDS =
	'C 109.702,0 101.687,8.4003 100.327,18.959 ' +
	'C 98.133,36.0019 90.214,56.3774 59.732,56.3774 ' +
	'C 28.557,56.3774 21.271,35.8003 19.506,18.7736 ' +
	'C 18.417,8.2666 10.564,0 0,0';

// Создаем замкнутый путь для маски.
const MASK_CUTOUT_PATH = `M ${CUTOUT_WIDTH},0 ${CUTOUT_CURVE_COMMANDS} L 0,0 Z`;

export const BottomNavBarWithCutout = (props: SvgProps) => {
	// Получаем реальную ширину экрана
	const { width } = useWindowDimensions();

	// Вычисляем X-координату для начала выреза, чтобы он был идеально по центру
	const cutoutX = (width - CUTOUT_WIDTH) / 2;

	return (
		// 1. Контейнер View для позиционирования и тени
		<View style={[styles.container, { width }]}>
			<Svg
				width={width} // Растягиваем на всю ширину
				height={BAR_HEIGHT} // Фиксированная высота
				// НИКАКОГО viewBox! Мы работаем в абсолютных координатах.
				{...props} // Передаем остальные пропсы, если нужно
			>
				{/* 2. Определяем маску (наш трафарет) */}
				<Defs>
					<Mask id='mask'>
						{/* Сначала рисуем белый фон - это то, что будет видно */}
						<Rect
							x='0'
							y='0'
							width={width}
							height={BAR_HEIGHT}
							fill='white'
						/>

						{/*
						  Теперь поверх белого фона рисуем наш вырез, но ЧЕРНЫМ цветом.
						  Черный цвет в маске означает "сделать эту область прозрачной".
						  Мы используем transform, чтобы сдвинуть наш заранее заготовленный
						  путь точно в центр верхнего края.
						*/}
						<Path
							d={MASK_CUTOUT_PATH}
							fill='black'
							transform={`translate(${cutoutX}, ${BAR_TOP_Y})`}
						/>
					</Mask>
				</Defs>

				{/* 3. Рисуем финальную фигуру */}
				{/* Это простой белый прямоугольник во всю ширину с закруглениями */}
				<Rect
					x='0'
					y='0'
					width='100%'
					height='100%'
					fill='white'
					rx={CORNER_RADIUS} // Скругляем углы
					// 4. Применяем нашу маску к этому прямоугольнику
					mask='url(#mask)'
				/>
			</Svg>
		</View>
	);
};

const styles = StyleSheet.create({
	// eslint-disable-next-line react-native/no-color-literals
	container: {
		height: BAR_HEIGHT,
		shadowColor: '#C6C6C6',
		marginTop: 'auto',
		shadowOffset: {
			width: 0,
			height: -3,
		},
		shadowOpacity: 0.25,
		shadowRadius: 8,
		elevation: 10, // для Android
	},
});
