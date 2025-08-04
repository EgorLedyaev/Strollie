import {
	Canvas,
	Circle,
	Group,
	LinearGradient,
	Paint,
	Path,
	RoundedRect,
	Shadow,
	vec,
} from '@shopify/react-native-skia';
import React from 'react';
import { Pressable, StyleSheet, ViewProps } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

const PLAY_ICON_PATH =
	'M41.9773 34.7326C38.4318 32.7065 34 35.2392 34 39.2914V47.7076C34 51.7599 38.4318 54.2926 41.9773 52.2664L49.3409 48.0583C52.8864 46.0322 52.8864 40.9669 49.3409 38.9407L41.9773 34.7326Z';
const GRADIENT_COLORS = ['#1BF57E', '#1CC4C4'];
const GRADIENT_POSITIONS = [0.165793, 1];
const SHADOW_COLOR_1 = 'rgba(169, 169, 169, 0.25)';
const SHADOW_COLOR_2 = 'rgba(170, 170, 170, 0.25)';
const PRESSED_OVERLAY_COLOR = 'rgba(31, 31, 31, 0.2)';

interface RouteToggleButtonProps extends ViewProps {
	isPlaying: boolean;
	onPress?: () => void;
}

const renderBase = () => (
	<Group
		layer={
			<Paint>
				<Shadow dx={2} dy={4} blur={3} color={SHADOW_COLOR_1} />
				<Shadow dx={-2} dy={-4} blur={3} color={SHADOW_COLOR_2} />
			</Paint>
		}
	>
		<Circle cx={42} cy={44} r={34}>
			<LinearGradient
				start={vec(8, 10)}
				end={vec(76, 78)}
				colors={GRADIENT_COLORS}
				positions={GRADIENT_POSITIONS}
			/>
		</Circle>
	</Group>
);

export const RouteToggleButton = ({
	isPlaying,
	onPress,
	style,
}: RouteToggleButtonProps) => {
	const pressProgress = useSharedValue(0);

	const animatedOverlayStyle = useAnimatedStyle(() => {
		return {
			opacity: pressProgress.value,
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
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			style={style}
		>
			<Canvas style={styles.buttonCanvas}>
				{isPlaying ? (
					// Состояние "Pause"
					<Group>
						{renderBase()}
						<RoundedRect
							x={33}
							y={33}
							width={7}
							height={22}
							r={3}
							color='white'
						/>
						<RoundedRect
							x={44}
							y={33}
							width={7}
							height={22}
							r={3}
							color='white'
						/>
					</Group>
				) : (
					// Состояние "Play"
					<Group>
						{renderBase()}
						<Path path={PLAY_ICON_PATH} color='white' />
					</Group>
				)}
			</Canvas>
			<Animated.View
				style={[styles.overlay, animatedOverlayStyle]}
				pointerEvents='none'
			>
				<Canvas style={styles.overlayCanvas}>
					<Circle
						cx={34}
						cy={34}
						r={34}
						color={PRESSED_OVERLAY_COLOR}
					/>
				</Canvas>
			</Animated.View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	buttonCanvas: {
		width: 84,
		height: 88,
	},
	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	overlayCanvas: {
		width: 68,
		height: 68,
	},
});
