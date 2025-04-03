import { Colors, Fonts, Radius } from '@/shared/tokens';
import {
	ActivityIndicator,
	GestureResponderEvent,
	Platform,
	Pressable,
	PressableProps,
	StyleSheet,
	Text,
} from 'react-native';
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface AppButtonProps extends PressableProps {
	text: string;
	isLoading?: boolean;
	variant?: ButtonVariant;
}

export const AppButton = ({
	text,
	isLoading,
	variant = 'primary',
	...props
}: AppButtonProps) => {
	const pressed = useSharedValue(0);
	const scale = useSharedValue(1);

	// Определение цветов вне анимированных функций
	const backgroundColors = getBackgroundColorsForVariant(variant);
	const textColor = variant === 'outline' ? Colors.green : Colors.white;
	const borderColor = variant === 'outline' ? Colors.green : 'transparent';

	const animatedStyles = useAnimatedStyle(() => {
		'worklet';
		const [baseColor, pressedColor] = backgroundColors;
		return {
			backgroundColor: interpolateColor(
				pressed.value,
				[0, 1],
				[baseColor, pressedColor],
			),
			transform: [{ scale: scale.value }],
		};
	});

	const handlePressIn = (e: GestureResponderEvent) => {
		pressed.value = withTiming(1, { duration: 100 });
		scale.value = withTiming(0.97, { duration: 100 });
		props.onPressIn?.(e);
	};

	const handlePressOut = (e: GestureResponderEvent) => {
		pressed.value = withTiming(0, { duration: 200 });
		scale.value = withTiming(1, { duration: 200 });
		props.onPressOut?.(e);
	};

	return (
		<Pressable
			{...props}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			style={styles.pressable}
			android_ripple={
				variant !== 'outline'
					? { color: 'rgba(255,255,255,0.2)' }
					: undefined
			}
		>
			<Animated.View
				style={[
					styles.button,
					animatedStyles,
					variant === 'outline' ? styles.outlineButton : undefined,
					variant !== 'outline' ? styles.shadow : undefined,
					styles[`${variant}Border`],
				]}
			>
				{!isLoading && (
					<Text style={[styles.text, styles[`${variant}Text`]]}>
						{text}
					</Text>
				)}
				{isLoading && (
					<ActivityIndicator size='large' color={textColor} />
				)}
			</Animated.View>
		</Pressable>
	);
};

// Вынесли функцию получения цветов за пределы компонента
function getBackgroundColorsForVariant(
	variant: ButtonVariant,
): [string, string] {
	switch (variant) {
		case 'primary':
			return [Colors.green, Colors.greenHover];
		case 'secondary':
			return [Colors.primary, Colors.primaryHover];
		case 'outline':
			return ['transparent', 'rgba(19, 224, 184, 0.1)'];
		default:
			return [Colors.green, Colors.greenHover];
	}
}

const styles = StyleSheet.create({
	pressable: {
		width: '100%',
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		borderRadius: Radius.r10,
		height: 58,
		overflow: 'hidden',
	},
	outlineButton: {
		borderWidth: 1.5,
	},
	// Стили для различных границ
	primaryBorder: {
		borderColor: 'transparent',
	},
	secondaryBorder: {
		borderColor: 'transparent',
	},
	outlineBorder: {
		borderColor: Colors.green,
	},
	// Стили для текста разных вариантов
	primaryText: {
		color: Colors.white,
	},
	secondaryText: {
		color: Colors.white,
	},
	outlineText: {
		color: Colors.green,
	},
	shadow: {
		...Platform.select({
			ios: {
				shadowColor: Colors.black,
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 4,
			},
			android: {
				elevation: 3,
			},
		}),
	},
	text: {
		fontSize: Fonts.f18,
		fontFamily: Fonts.semibold,
		textAlign: 'center',
	},
});
