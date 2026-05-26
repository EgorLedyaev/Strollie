import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	GestureResponderEvent,
	Pressable,
	PressableProps,
	StyleSheet,
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';

import { AppText } from '../Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export interface AppButtonProps extends PressableProps {
	/** Текст кнопки. Если переданы children — опционален */
	text?: string;
	isLoading?: boolean;
	variant?: ButtonVariant;
	buttonColor?: string;
	buttonBorderRadius?: number;
	buttonHeight?: number;
	textColor?: string;
	textFontSize?: number;
	textFontFamily?: string;
	paddingHorizontal?: number;
	paddingVertical?: number;
	dimFactor?: number;
	sizeActivityIndicator?: number | 'large' | 'small' | undefined;
	/** Кастомный контент. При наличии полностью заменяет text/иконки */
	children?: ReactNode;
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
	buttonHeight = 52,
	textColor = Colors.white,
	textFontSize = Fonts.f18,
	textFontFamily = Fonts.semibold,
	dimFactor = 0.85,
	sizeActivityIndicator = 'large',
	paddingHorizontal,
	paddingVertical,
	children,
	style,
	...props
}: AppButtonProps) => {
	const scale = useSharedValue(1);

	const isSecondary = variant === 'secondary';
	const isOutline = variant === 'outline';
	const isDisabled = !!disabled || !!isLoading;

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
		if (isDisabled) return disabledColors;
		if (isOutline) return ['transparent', 'transparent'] as const;
		return isSecondary ? secondaryColors : primaryColors;
	};

	const [currentColors, setCurrentColors] = useState(getInitialColors);

	useEffect(() => {
		setCurrentColors(getInitialColors());
	}, [isDisabled, variant, buttonColor, dimFactor]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
		};
	});

	const handlePressIn = (e: GestureResponderEvent) => {
		if (isDisabled) return;
		scale.value = withTiming(0.97, { duration: 100 });
		setCurrentColors(
			isSecondary ? dimmedSecondaryColors : dimmedPrimaryColors,
		);
		props.onPressIn?.(e);
	};

	const handlePressOut = (e: GestureResponderEvent) => {
		if (isDisabled) return;
		scale.value = withTiming(1, { duration: 200 });
		setCurrentColors(isSecondary ? secondaryColors : primaryColors);
		props.onPressOut?.(e);
	};

	const textStyle = {
		fontSize: textFontSize,
		fontFamily: textFontFamily,
		color: isDisabled
			? Colors.grayMedium
			: isSecondary || isOutline
				? (textColor ?? Colors.greenPrimary)
				: Colors.white,
		paddingHorizontal: paddingHorizontal,
		paddingVertical: paddingVertical,
	};

	const renderInnerContent = () => {
		if (children) {
			return children;
		}
		// Базовый случай — только текст (как раньше)
		return (
			<AppText
				style={[
					styles.text,
					isDisabled && styles.disabledText,
					textStyle,
				]}
			>
				{text}
			</AppText>
		);
	};

	return (
		<Pressable
			style={state => [
				{ height: buttonHeight, minHeight: buttonHeight },
				typeof style === 'function' ? style(state) : style,
			]}
			{...props}
			disabled={isDisabled}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			accessibilityRole='button'
			accessibilityState={{ disabled: isDisabled }}
		>
			<Animated.View style={[styles.buttonContainer, animatedStyle]}>
				{isOutline ? (
					// Outline: прозрачный фон, рамка
					<Animated.View
						style={[
							styles.outline,
							{
								borderRadius: buttonBorderRadius,
								borderColor: Colors.greenPrimary,
							},
						]}
					>
						{!isLoading ? (
							renderInnerContent()
						) : (
							<ActivityIndicator
								size={sizeActivityIndicator}
								color={Colors.greenPrimary}
							/>
						)}
					</Animated.View>
				) : (
					<LinearGradient
						colors={currentColors}
						start={{ x: 0, y: 0 }}
						end={{ x: 0, y: 1.2 }}
						style={[
							styles.gradient,
							!isSecondary && !isOutline ? styles.shadow : null,
							{ borderRadius: buttonBorderRadius },
						]}
					>
						{!isLoading ? (
							renderInnerContent()
						) : (
							<ActivityIndicator
								size={sizeActivityIndicator}
								color={
									isOutline
										? Colors.greenPrimary
										: Colors.white
								}
							/>
						)}
					</LinearGradient>
				)}
			</Animated.View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		flex: 1,
		width: '100%',
	},
	disabledText: {
		color: Colors.grayMedium,
	},
	gradient: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		overflow: 'hidden',
	},
	outline: {
		alignItems: 'center',
		backgroundColor: Colors.transparent,
		borderWidth: 1,
		flex: 1,
		justifyContent: 'center',
	},
	shadow: {
		boxShadow: Shadows.boxShadow_elev2,
	},
	text: {
		textAlign: 'center',
	},
});
