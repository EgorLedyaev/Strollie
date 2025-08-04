import {
	Canvas,
	Circle,
	Group,
	Paint,
	Path,
	RoundedRect,
	Shadow,
	Skia,
	Text,
	useFont,
} from '@shopify/react-native-skia';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Radius } from '@/shared/tokens';

// Размеры из SVG <rect>
export const WIDGET_WIDTH = 100;
export const WIDGET_HEIGHT = 46;
export const WIDGET_RADIUS = 15;

// Смещения из SVG, чтобы правильно позиционировать элементы внутри Canvas
export const SVG_VIEWBOX_X_OFFSET = 8;
export const SVG_VIEWBOX_Y_OFFSET = 10;

// Параметры солнца из SVG <ellipse> с учетом смещения
export const SUN_CENTER_X = 31.5 - SVG_VIEWBOX_X_OFFSET; // 23.5
export const SUN_CENTER_Y = 59 - SVG_VIEWBOX_Y_OFFSET; // 49
export const SUN_RADIUS_X = 30.5;
export const SUN_RADIUS_Y = 31;
export const SUN_COLOR = '#FFF96C';

// Параметры облака из SVG <path>
export const CLOUD_COLOR = '#FFD66C';
const CLOUD_SVG_PATH =
	'M13.1109 34.885C14.2826 49.6801 26.0561 61.8224 41.2823 62.9725C49.1272 63.5651 56.5029 61.1333 62.2743 56.6618C62.3985 58.2283 62.4056 59.8246 62.2835 61.4407C61.0085 78.3195 46.3246 90.971 29.4866 89.699C12.6489 88.4269 0.0328918 73.7134 1.30784 56.8347C1.9888 47.8198 6.49485 40.0111 13.1109 34.885Z';
export const skiaCloudPath = Skia.Path.MakeFromSVGString(CLOUD_SVG_PATH);

// Шрифты
export const TEMPERATURE_FONT_SIZE = 20;
export const TEMPERATURE_TEXT_COLOR = '#FFFFFF';
export const TEMPERATURE_TEXT_Y_OFFSET = WIDGET_HEIGHT / 2 + 7; // Для вертикального центрирования
export const TEMPERATURE_TEXT_RIGHT_PADDING = 8;

interface WeatherWidgetProps {
	temperature: number;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
	temperature,
}) => {
	const temperatureFont = useFont(
		require('@/assets/fonts/SuisseIntl-Medium.otf'),
		TEMPERATURE_FONT_SIZE,
	);

	if (!temperatureFont) {
		return <View style={styles.container} />; // Возвращаем заглушку, пока шрифт грузится
	}

	const tempText = temperature > 0 ? `+${temperature}°` : `${temperature}°`;
	const textWidth = temperatureFont.getTextWidth(tempText);
	const textXPosition =
		WIDGET_WIDTH - textWidth - TEMPERATURE_TEXT_RIGHT_PADDING;

	return (
		<View style={styles.container}>
			<Canvas style={styles.canvas}>
				{/* Основной фон с тенями */}
				<Group
					layer={
						<Paint>
							<Shadow
								dx={2}
								dy={4}
								blur={3}
								color='rgba(169, 169, 169, 0.25)'
							/>
							<Shadow
								dx={-2}
								dy={-4}
								blur={3}
								color='rgba(170, 170, 170, 0.25)'
							/>
						</Paint>
					}
				>
					<RoundedRect
						x={0}
						y={0}
						width={WIDGET_WIDTH}
						height={WIDGET_HEIGHT}
						r={WIDGET_RADIUS}
						color='#84C2F0'
					/>
				</Group>

				{/* Клипаем все, что выходит за рамки фона */}
				<Group
					clip={{
						x: 0,
						y: 0,
						width: WIDGET_WIDTH,
						height: WIDGET_HEIGHT,
						rx: WIDGET_RADIUS,
						ry: WIDGET_RADIUS,
					}}
				>
					{/* Группа для солнца и облака с коррекцией позиции */}
					<Group
						transform={[
							{ translateX: -SVG_VIEWBOX_X_OFFSET },
							{ translateY: -SVG_VIEWBOX_Y_OFFSET },
						]}
						layer={
							<Paint>
								<Shadow
									dx={7}
									dy={-6}
									blur={6.15}
									color='rgba(255, 249, 108, 0.3)'
								/>
							</Paint>
						}
					>
						<Circle
							cx={SUN_CENTER_X + SVG_VIEWBOX_X_OFFSET}
							cy={SUN_CENTER_Y + SVG_VIEWBOX_Y_OFFSET}
							r={SUN_RADIUS_X}
							color={SUN_COLOR}
						/>
						{skiaCloudPath && (
							<Path path={skiaCloudPath} color={CLOUD_COLOR} />
						)}
					</Group>
				</Group>

				{/* Текст температуры */}
				<Text
					x={textXPosition}
					y={TEMPERATURE_TEXT_Y_OFFSET}
					text={tempText}
					font={temperatureFont}
					color={TEMPERATURE_TEXT_COLOR}
				/>
			</Canvas>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: WIDGET_WIDTH,
		height: WIDGET_HEIGHT,
		borderRadius: Radius.r15,
		overflow: 'hidden',
	},
	canvas: {
		width: '100%',
		height: '100%',
	},
});
