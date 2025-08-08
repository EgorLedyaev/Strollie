import {
	Blend,
	Canvas,
	FractalNoise,
	RadialGradient,
	RoundedRect,
	RuntimeShader,
	Skia,
	vec,
} from '@shopify/react-native-skia';
import React from 'react';
import { StyleSheet } from 'react-native';

import { Radius } from '@/shared/tokens';

interface GridItemBackgroundProps {
	width: number;
	height: number;
}

const GRADIENT_COLORS = ['#3DEA90', 'rgba(40, 232, 127, 0)'];
const DEGREES_TO_RADIANS = Math.PI / 180;

// Создаем наш кастомный шейдер для управления прозрачностью
const OPACITY_SHADER_SOURCE = Skia.RuntimeEffect.Make(`
  // 'content' - это входной шейдер (в нашем случае - результат Blend)
  uniform shader content; 
  // 'opacity' - это переменная, которую мы передадим из React Native
  uniform float opacity;

  half4 main(vec2 pos) {
    // Получаем цвет пикселя из входного шейдера
    half4 color = content.eval(pos);
    return color * opacity;
  }
`)!;

export const GridItemBackground: React.FC<GridItemBackgroundProps> = ({
	width,
	height,
}) => {
	// Трансформация для градиента остается прежней, она корректна.

	const gradientTransform = [
		{ translateX: 34 },
		{ translateY: 158.5 },
		{ rotate: -81.1932 * DEGREES_TO_RADIANS },
		{ scaleX: 174.028 },
		{ scaleY: 107.771 },
	];

	return (
		<Canvas style={styles.canvas}>
			{/* Слой 1: Базовый белый фон */}
			<RoundedRect
				x={0}
				y={0}
				width={width}
				height={height}
				r={Radius.r15}
				color={'white'}
			/>
			{/* Слой 2: Наш сложный текстурированный градиент */}
			<RoundedRect
				x={0}
				y={0}
				width={width}
				height={height}
				r={Radius.r15}
			>
				<RuntimeShader
					source={OPACITY_SHADER_SOURCE}
					uniforms={{
						opacity: 0.1,
					}}
				>
					{/* 
                      Смешиваем два шейдера: цвет (градиент) и текстуру (шум).
                      Режим 'multiply' затемнит градиент в местах, где шум темнее,
                      создавая эффект текстуры.
                    */}
					<Blend mode='multiply'>
						{/* 
                          Шейдер шума. Высокая частота (freq) создает мелкую "крапинку".
                          Малое количество октав (octaves) делает текстуру проще.
                        */}
						<FractalNoise
							freqX={0.4}
							freqY={0.4}
							octaves={2}
							seed={20}
						/>
						{/* Наш оригинальный радиальный градиент с трансформацией */}
						<RadialGradient
							c={vec(0, 0)}
							r={1}
							colors={GRADIENT_COLORS}
							transform={gradientTransform}
						/>
					</Blend>
				</RuntimeShader>
			</RoundedRect>
		</Canvas>
	);
};

const styles = StyleSheet.create({
	canvas: {
		...StyleSheet.absoluteFillObject,
		borderRadius: Radius.r15,
		overflow: 'hidden',
	},
});
