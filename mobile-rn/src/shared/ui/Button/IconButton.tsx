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

interface IconButtonProps extends Omit<PressableProps, 'children'> {
	style?: View['props']['style'];
	children: ReactNode | ((state: PressableStateCallbackType) => ReactNode);
}
export const IconButton: React.FC<IconButtonProps> = ({
	style,
	onPress,
	children,
	disabled = false,
	...props
}) => {
	const pressProgress = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: `rgba(0, 0, 0, ${pressProgress.value * 0.25})`,
		};
	});

	const handlePressIn = () => {
		pressProgress.value = withTiming(1, { duration: 100 });
	};

	const handlePressOut = () => {
		pressProgress.value = withTiming(0, { duration: 200 });
	};

	return (
		<Pressable
			style={[styles.button, style]}
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			disabled={disabled}
			{...props}
		>
			{(pressableState: PressableStateCallbackType) => (
				<>
					{typeof children === 'function'
						? children(pressableState)
						: children}
					<Animated.View
						style={[styles.overlay, animatedStyle]}
						pointerEvents='none'
					/>
				</>
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		// overflow: 'hidden' нужен, чтобы overlay не вылезал за скругленные углы
		overflow: 'hidden',
	},

	overlay: {
		...StyleSheet.absoluteFillObject,
	},
});
