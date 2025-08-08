import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, GestureResponderEvent, Pressable, PressableProps, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';



import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';



import { AppText } from '../Text';


type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface AppButtonProps extends PressableProps {
	text: string;
	isLoading?: boolean;
	variant?: ButtonVariant;
	buttonColor?: string;
	buttonBorderRadius?: number;
	textColor?: string;
	textFontSize?: number;
	textFontFamily?: string;
	dimFactor?: number;
	sizeActivityIndicator?: number | 'large' | 'small' | undefined;
}

// Цвета градиента
const GRADIENT_START = Colors.greenPrimary;
const GRADIENT_END = Colors.greenSecondary;

function dimColor(hex: string, dimFactor = 0.75): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
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
	buttonColor = Colors.grayBackground,
	buttonBorderRadius = Radius.r20,
	textColor = Colors.white,
	textFontSize = Fonts.f18,
	textFontFamily = Fonts.semibold,
	dimFactor = 0.85,
	sizeActivityIndicator = 'large',
	style,
	...props
}: AppButtonProps) => {
	const scale = useSharedValue(1);

	const isSecondary = variant === 'secondary';

	const primaryColors = [GRADIENT_START, GRADIENT_END] as const;
	const dimmedPrimaryColors = [
		dimColor(GRADIENT_START),
		dimColor(GRADIENT_END),
	] as const;
	const secondaryColors = [buttonColor, buttonColor] as const;
	const dimmedSecondaryColors = [
		dimColor(buttonColor, dimFactor),
		dimColor(buttonColor, dimFactor),
	] as const;

	const disabledColors = [Colors.disabledGray, Colors.disabledGray] as const;

	const getInitialColors = () => {
		if (disabled) return disabledColors;
		return isSecondary ? secondaryColors : primaryColors;
	};

	const [currentColors, setCurrentColors] = useState(getInitialColors);

	useEffect(() => {
		setCurrentColors(getInitialColors());
	}, [disabled, variant]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
		};
	});

	const handlePressIn = (e: GestureResponderEvent) => {
		if (disabled) return;

		scale.value = withTiming(0.97, { duration: 100 });
		setCurrentColors(
			isSecondary ? dimmedSecondaryColors : dimmedPrimaryColors,
		);
		props.onPressIn?.(e);
	};

	const handlePressOut = (e: GestureResponderEvent) => {
		if (disabled) return;

		scale.value = withTiming(1, { duration: 200 });
		setCurrentColors(isSecondary ? secondaryColors : primaryColors);
		props.onPressOut?.(e);
	};
	const textStyle = {
		fontSize: textFontSize,
		fontFamily: textFontFamily,
		color: disabled
			? Colors.grayMedium
			: isSecondary
				? textColor
				: Colors.white,
	};
	return (
		<Pressable
			style={style}
			{...props}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
		>
			<Animated.View style={[styles.buttonContainer, animatedStyle]}>
				<LinearGradient
					colors={currentColors}
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}
					style={[
						styles.gradient,
						variant !== 'outline' && !isSecondary
							? styles.shadow
							: null,
						{
							borderRadius: buttonBorderRadius,
						},
					]}
				>
					{!isLoading && (
						<AppText
							style={[
								styles.text,
								disabled && styles.disabledText,
								textStyle,
							]}
						>
							{text}
						</AppText>
					)}
					{isLoading && (
						<ActivityIndicator
							size={sizeActivityIndicator}
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
	buttonContainer: {
		width: '100%',
		height: '100%',
	},
	gradient: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		overflow: 'hidden',
	},
	shadow: {
		boxShadow: Shadows.boxShadow_elev2,
	},
	text: {
		textAlign: 'center',
	},
	disabledText: {
		color: Colors.grayMedium,
	},
});