import { ReactNode } from 'react';
import {
	Pressable,
	PressableProps,
	PressableStateCallbackType,
	StyleSheet,
	View,
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface IconButtonProps extends Omit<PressableProps, 'children'> {
	style?: View['props']['style'];
	children: ReactNode | ((state: PressableStateCallbackType) => ReactNode);
	feedback?: 'overlay' | 'opacity';
	opacity?: number; // Прозрачность для эффекта "opacity"
}

export const IconButton: React.FC<IconButtonProps> = ({
	style,
	onPress,
	children,
	disabled = false,
	feedback = 'overlay', // По умолчанию - затемнение
	opacity = 0.3,
	...props
}) => {
	const pressProgress = useSharedValue(0);

	const handlePressIn = () => {
		pressProgress.value = withTiming(1, { duration: 100 });
	};

	const handlePressOut = () => {
		pressProgress.value = withTiming(0, { duration: 200 });
	};

	// Анимированный стиль для оверлея
	const overlayAnimatedStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: `rgba(0, 0, 0, ${pressProgress.value * 0.25})`,
		};
	});

	// Анимированный стиль для прозрачности контента
	const animatedStyle = useAnimatedStyle(() => {
		if (feedback === 'opacity') {
			return {
				opacity: 1 - pressProgress.value * (1 - opacity),
			};
		} else {
			// Для overlay режима возвращаем пустой объект
			return {};
		}
	});

	return (
		<AnimatedPressable
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			disabled={disabled}
			style={[styles.button, style, animatedStyle]}
			{...props}
		>
			{(pressableState: PressableStateCallbackType) => (
				<>
					{typeof children === 'function'
						? children(pressableState)
						: children}
					{feedback === 'overlay' && (
						<Animated.View
							style={[styles.overlay, overlayAnimatedStyle]}
							pointerEvents='none'
						/>
					)}
				</>
			)}
		</AnimatedPressable>
	);
};

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
	},
});
