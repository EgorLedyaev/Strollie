import { Colors, Fonts, Radius } from '@/src/shared/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
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

// Цвета градиента
// Цвета градиента - обновлены в соответствии с макетом
const GRADIENT_START = Colors.greenPrimary;
const GRADIENT_END = Colors.greenSecondary;

function dimColor(hex: string): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	const dimFactor = 0.5;
	const dimR = Math.round(r * dimFactor);
	const dimG = Math.round(g * dimFactor);
	const dimB = Math.round(b * dimFactor);
	return `#${dimR.toString(16).padStart(2, '0')}${dimG.toString(16).padStart(2, '0')}${dimB.toString(16).padStart(2, '0')}`;
}

export const AppButton = ({
	text,
	isLoading,
	variant = 'primary',
	disabled,
	...props
}: AppButtonProps) => {
	const pressed = useSharedValue(0);
	const scale = useSharedValue(1);

	const gradientColors = [GRADIENT_START, GRADIENT_END] as const;
	const dimmedGradientColors = [
		dimColor(GRADIENT_START),
		dimColor(GRADIENT_END),
	] as const;
	const disabledColors = [Colors.disabledGray, Colors.disabledGray] as const;
	const [currentColors, setCurrentColors] = useState(disabled ? disabledColors : gradientColors);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
		};
	});

	const handlePressIn = (e: GestureResponderEvent) => {
		if (disabled) return;
		
		pressed.value = withTiming(1, { duration: 100 });
		scale.value = withTiming(0.97, { duration: 100 });
		setCurrentColors(dimmedGradientColors);
		props.onPressIn?.(e);
	};

	const handlePressOut = (e: GestureResponderEvent) => {
		if (disabled) return;
		
		pressed.value = withTiming(0, { duration: 200 });
		scale.value = withTiming(1, { duration: 200 });
		setCurrentColors(gradientColors);
		props.onPressOut?.(e);
	};

	return (
		<Pressable
			{...props}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			style={styles.pressable}
		>
			<Animated.View style={[styles.buttonContainer, animatedStyle]}>
				<LinearGradient
					colors={currentColors}
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}
					style={[
						styles.button,
						variant === 'outline' ? styles.outlineButton : null,
						variant !== 'outline' ? styles.shadow : null,
					]}
				>
					{!isLoading && <Text style={[styles.text, disabled && styles.disabledText]}>{text}</Text>}
					{isLoading && (
						<ActivityIndicator
							size='large'
							color={
								variant === 'outline'
									? Colors.greenPrimary
									: Colors.white
							}
						/>
					)}
				</LinearGradient>
			</Animated.View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	pressable: {
		width: '100%',
	},
	buttonContainer: {
		width: '100%',
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		borderRadius: Radius.r20,
		height: 58,
		overflow: 'hidden',
	},
	outlineButton: {
		borderWidth: 1.5,
		borderColor: Colors.greenPrimary,
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
		color: Colors.white,
	},
	disabledText: {
		color: Colors.grayMedium,
	},
});
