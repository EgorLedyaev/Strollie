import {
	Canvas,
	Circle,
	Group,
	Paint,
	Path,
	RoundedRect,
	rrect,
	Shadow,
	Skia,
	Text,
	useFont,
} from '@shopify/react-native-skia';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// Определяем параметры виджета и тени
export const WIDGET_WIDTH = 100;
export const WIDGET_HEIGHT = 46;
export const WIDGET_RADIUS = 15;

const SHADOW_DX = 2;
const SHADOW_DY = 4;
const SHADOW_BLUR = 6;
const SHADOW_COLOR = 'rgba(169, 169, 169, 0.25)';
export const SHADOW_PADDING = SHADOW_BLUR * 2; // Добавляем запас для размытия

// Рассчитываем полный размер холста, чтобы вместить тень
const CANVAS_WIDTH = WIDGET_WIDTH + SHADOW_PADDING * 2;
const CANVAS_HEIGHT = WIDGET_HEIGHT + SHADOW_PADDING * 2;

// Позиция самого виджета внутри холста
const WIDGET_X = SHADOW_PADDING;
const WIDGET_Y = SHADOW_PADDING;

// Параметры SVG элементов, как и раньше
export const SVG_VIEWBOX_X_OFFSET = 8;
export const SVG_VIEWBOX_Y_OFFSET = 10;
export const SUN_CENTER_X = 31.5;
export const SUN_CENTER_Y = 59;
export const SUN_RADIUS_X = 30.5;
export const SUN_COLOR = '#FFF96C';
export const CLOUD_COLOR = '#FFD66C';
const CLOUD_SVG_PATH =
	'M13.1109 34.885C14.2826 49.6801 26.0561 61.8224 41.2823 62.9725C49.1272 63.5651 56.5029 61.1333 62.2743 56.6618C62.3985 58.2283 62.4056 59.8246 62.2835 61.4407C61.0085 78.3195 46.3246 90.971 29.4866 89.699C12.6489 88.4269 0.0328918 73.7134 1.30784 56.8347C1.9888 47.8198 6.49485 40.0111 13.1109 34.885Z';
export const skiaCloudPath = Skia.Path.MakeFromSVGString(CLOUD_SVG_PATH);

// Шрифты
export const TEMPERATURE_FONT_SIZE = 20;
export const TEMPERATURE_TEXT_COLOR = '#FFFFFF';
export const TEMPERATURE_TEXT_Y_OFFSET = WIDGET_HEIGHT / 2 + 7;
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
		return <View style={styles.container} />;
	}

	const tempText = temperature > 0 ? `+${temperature}°` : `${temperature}°`;
	const textWidth = temperatureFont.measureText(tempText).width;
	const textXPosition =
		WIDGET_X + WIDGET_WIDTH - textWidth - TEMPERATURE_TEXT_RIGHT_PADDING;

	const clipRRect = rrect(
		{
			x: WIDGET_X,
			y: WIDGET_Y,
			width: WIDGET_WIDTH,
			height: WIDGET_HEIGHT,
		},
		WIDGET_RADIUS,
		WIDGET_RADIUS,
	);

	return (
		<View style={styles.container}>
			<Canvas style={styles.canvas}>
				{/* Основной фон с тенями */}
				<Group
					layer={
						<Paint>
							{/* Мы используем один Shadow, т.к. в вашем примере они были одинаковые */}
							<Shadow
								dx={SHADOW_DX}
								dy={SHADOW_DY}
								blur={SHADOW_BLUR}
								color={SHADOW_COLOR}
							/>
							<Shadow
								dx={-SHADOW_DX}
								dy={-SHADOW_DY}
								blur={SHADOW_BLUR}
								color={SHADOW_COLOR}
							/>
						</Paint>
					}
				>
					<RoundedRect
						x={WIDGET_X}
						y={WIDGET_Y}
						width={WIDGET_WIDTH}
						height={WIDGET_HEIGHT}
						r={WIDGET_RADIUS}
						color='#84C2F0'
					/>
				</Group>

				{/* Клипаем все, что выходит за рамки фона, используя Skia, а не CSS */}
				<Group clip={clipRRect}>
					<Group
						transform={[
							{ translateX: WIDGET_X - SVG_VIEWBOX_X_OFFSET },
							{ translateY: WIDGET_Y - SVG_VIEWBOX_Y_OFFSET },
						]}
					>
						<Circle
							cx={SUN_CENTER_X}
							cy={SUN_CENTER_Y}
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
					y={WIDGET_Y + TEMPERATURE_TEXT_Y_OFFSET}
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
		width: CANVAS_WIDTH,
		height: CANVAS_HEIGHT,
	},
	canvas: {
		width: '100%',
		height: '100%',
	},
});
