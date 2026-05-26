import { ComponentRef, forwardRef, ReactNode } from 'react';
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

export interface ActionTouchableProps extends Omit<PressableProps, 'children'> {
	style?: View['props']['style'];
	children: ReactNode | ((state: PressableStateCallbackType) => ReactNode);
	feedback?: 'overlay' | 'opacity';
	opacity?: number; // Прозрачность для эффекта "opacity"
}

type PressableRef = ComponentRef<typeof Pressable>;

export const ActionTouchable = forwardRef<PressableRef, ActionTouchableProps>(
	(
		{
			style,
			onPress,
			children,
			disabled = false,
			feedback = 'overlay', // По умолчанию - затемнение
			opacity = 0.3,
			...props
		},
		ref,
	) => {
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
		const opacityFactor = 1 - opacity; // Вычисляем один раз вне worklet
		const animatedStyle = useAnimatedStyle(() => {
			// Для opacity режима используем опакность
			return {
				opacity: 1 - pressProgress.value * opacityFactor,
			};
		});

		return (
			<AnimatedPressable
				ref={ref}
				onPress={onPress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				disabled={disabled}
				style={[
					styles.button,
					style,
					feedback === 'opacity' ? animatedStyle : undefined,
				]}
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
	},
);

ActionTouchable.displayName = 'ActionTouchable';

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
