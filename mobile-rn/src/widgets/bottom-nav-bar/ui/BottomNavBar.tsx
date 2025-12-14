import {
	BottomNavBarWithCutout,
	VERTICAL_PADDING as NAV_BAR_VERTICAL_PADDING,
} from '@/assets/icons/BottomNavBarWithCutout';
import SettingsIcon from '@/assets/icons/SettingsIcon';
import TransportIcon from '@/assets/icons/TransportIcon';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

import { Colors, Radius, Shadows } from '@/shared/tokens';
import { ActionTouchable } from '@/shared/ui';

import { RouteToggleButton } from './RouteToggleButton';

// КОНСТАНТЫ
const NAV_BAR_HEIGHT = 117;
const ICON_AREA_HEIGHT = 72;
// const PANEL_HEIGHT = 140;
// const TOTAL_HEIGHT = NAV_BAR_HEIGHT + PANEL_HEIGHT;
// const SPRING_CONFIG = {
// 	damping: 15,
// 	stiffness: 100,
// 	mass: 0.8,
// };
const TRANSLATE_Y = 20;

interface BottomNavBarProps {
	isVisible: boolean;
	isRouteActive: boolean;
	onRouteToggle: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
	isVisible,
	isRouteActive,
	onRouteToggle,
}) => {
	// const MAX_TRANSLATE_Y = -PANEL_HEIGHT;
	// const SNAP_POINT = MAX_TRANSLATE_Y / 2;

	// Shared values
	// const translateY = useSharedValue(MAX_TRANSLATE_Y);
	// const startY = useSharedValue(0);
	const router = useRouter();

	const visibilityTranslateY = useSharedValue(
		isVisible ? 0 : NAV_BAR_HEIGHT + TRANSLATE_Y,
	);
	const [pointerEventsState, setPointerEventsState] = useState<
		'auto' | 'none'
	>(isVisible ? 'auto' : 'none');

	useEffect(() => {
		visibilityTranslateY.value = withTiming(
			isVisible ? 0 : NAV_BAR_HEIGHT + TRANSLATE_Y,
			{
				duration: 250,
			},
		);
	}, [isVisible]);

	useEffect(() => {
		setPointerEventsState(isVisible ? 'auto' : 'none');
	}, [isVisible]);

	// const panGesture = Gesture.Pan()
	// 	.onBegin(() => {
	// 		startY.value = translateY.value;
	// 	})
	// 	.onUpdate(event => {
	// 		let newTranslateY = startY.value + event.translationY;
	// 		// Ограничиваем перетаскивание
	// 		newTranslateY = Math.max(newTranslateY, MAX_TRANSLATE_Y);
	// 		newTranslateY = Math.min(newTranslateY, 0);
	// 		translateY.value = newTranslateY;
	// 	})
	// 	.onEnd(event => {
	// 		// Улучшенная логика прилипания с учетом скорости
	// 		const velocity = event.velocityY;
	// 		const shouldSnapUp =
	// 			translateY.value < SNAP_POINT || velocity < -500;
	//
	// 		if (shouldSnapUp) {
	// 			translateY.value = withSpring(MAX_TRANSLATE_Y, SPRING_CONFIG);
	// 		} else {
	// 			translateY.value = withSpring(0, SPRING_CONFIG);
	// 		}
	// 	});

	// Создаем Tap жест, который будет "поглощать" нажатия, чтобы они не проходили на карту.
	// const tapGesture = Gesture.Tap();

	// Объединяем жесты. Race гарантирует, что только один жест (pan или tap) будет активен в один момент времени.
	// Это предотвратит прохождение нажатий сквозь панель.
	// const composedGesture = Gesture.Race(panGesture, tapGesture);

	// Анимированные стили
	// const animatedContainerStyle = useAnimatedStyle(() => {
	// 	return {
	// 		transform: [{ translateY: translateY.value }],
	// 	};
	// });

	const animatedVisibilityStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: visibilityTranslateY.value }],
		};
	});

	// const [playing, setPlaying] = useState(false);

	// Обработчики нажатий
	const handleNavDisplayPress = () => {
		console.log('Transport icon pressed');
	};

	const handleNavSettingsPress = () => {
		router.push('/settings');
	};

	// const handleNavNotificationPress = () => {
	// 	console.log('Notification pressed');
	// };
	//
	const handleNavRoutePress = () => {
		onRouteToggle();
	};
	//
	// const handleNavChatPress = () => {
	// 	console.log('Chat pressed');
	// };

	return (
		<Animated.View
			style={[styles.container, animatedVisibilityStyle]}
			pointerEvents={pointerEventsState}
		>
			{/*<GestureDetector gesture={composedGesture}>*/}
			{/*<Animated.View*/}
			{/*	style={[*/}
			{/*		styles.container,*/}
			{/*		{*/}
			{/*			height: TOTAL_HEIGHT,*/}
			{/*			bottom: -PANEL_HEIGHT,*/}
			{/*		},*/}
			{/*		animatedContainerStyle,*/}
			{/*	]}*/}
			{/*>*/}
			{/*<View style={[styles.navBarContainer, { height: NAV_BAR_HEIGHT }]}>*/}
			<View style={styles.navBarContainer}>
				<View
					style={{
						transform: [
							{
								translateY: -(NAV_BAR_VERTICAL_PADDING / 2),
							},
						],
					}}
				>
					<BottomNavBarWithCutout />
				</View>
				<View style={styles.navBarIcons}>
					<ActionTouchable
						style={styles.navBarButton}
						children={<TransportIcon />}
						// onPress={handleNavChatPress}
						onPress={handleNavDisplayPress}
					/>

					<RouteToggleButton
						// isPlaying={playing}
						// onPress={handleNavRoutePress}
						// style={styles.centerButton}
						isPlaying={isRouteActive}
						onPress={handleNavRoutePress}
						style={styles.centerButton}
					/>
					<ActionTouchable
						style={styles.navBarButton}
						// onPress={handleNavNotificationPress}
						onPress={handleNavSettingsPress}
						children={<SettingsIcon />}
						// children={<NotificationIcon />}
					/>
				</View>
			</View>
			{/*<View style={styles.backgroundBetween} />*/}
			{/*<View*/}
			{/*	style={[*/}
			{/*		styles.panelContainer,*/}
			{/*		{ height: PANEL_HEIGHT },*/}
			{/*	]}*/}
			{/*>*/}
			{/*	<View style={styles.panelContent}>*/}
			{/*		<ActionTouchable*/}
			{/*			children={<FeedIcon />}*/}
			{/*			style={styles.panelButton}*/}
			{/*		/>*/}
			{/*		<AppText style={styles.panelButtonText}>*/}
			{/*			Лента*/}
			{/*		</AppText>*/}
			{/*	</View>*/}
			{/*	<View style={styles.panelContent}>*/}
			{/*		<ActionTouchable*/}
			{/*			children={<ScheduleIcon />}*/}
			{/*			style={styles.panelButton}*/}
			{/*		/>*/}
			{/*		<AppText style={styles.panelButtonText}>*/}
			{/*			Афиша*/}
			{/*		</AppText>*/}
			{/*	</View>*/}
			{/*	<View style={styles.panelContent}>*/}
			{/*		<ActionTouchable*/}
			{/*			children={<SettingsIcon />}*/}
			{/*			style={styles.panelButton}*/}
			{/*		/>*/}
			{/*		<AppText style={styles.panelButtonText}>*/}
			{/*			Настройки*/}
			{/*		</AppText>*/}
			{/*	</View>*/}
			{/*</View>*/}
			{/*</Animated.View>*/}
			{/*</GestureDetector>*/}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	centerButton: {
		transform: [{ translateY: -TRANSLATE_Y }],
	},
	container: {
		backgroundColor: Colors.transparent,
		bottom: 0,
		gap: 5,
		height: NAV_BAR_HEIGHT,
		left: 0,
		position: 'absolute',
		right: 0,
	},
	navBarButton: {
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r16,
		boxShadow: Shadows.boxShadow_elev1,
		height: 40,
		width: 40,
	},
	navBarContainer: {},
	navBarIcons: {
		alignItems: 'center',
		bottom: 0,
		flexDirection: 'row',
		height: ICON_AREA_HEIGHT,
		justifyContent: 'space-evenly',
		left: 0,
		position: 'absolute',
		right: 0,
		top: 0,
	},

	// panelButton: {
	// 	backgroundColor: Colors.grayBackground,
	// 	borderRadius: Radius.r16,
	// 	boxShadow: Shadows.boxShadow_elev1,
	// 	height: 50,
	// 	width: 80,
	// },
	//
	// panelButtonText: {
	// 	color: Colors.grayText,
	// 	fontSize: Fonts.f12,
	// },
	// panelContainer: {
	// 	backgroundColor: Colors.white,
	// 	borderTopLeftRadius: Radius.r20,
	// 	borderTopRightRadius: Radius.r20,
	// 	boxShadow: Shadows.boxShadow_elev1,
	// 	flexDirection: 'row',
	// 	justifyContent: 'space-evenly',
	// 	paddingTop: 16,
	// },
	//
	// panelContent: {
	// 	alignItems: 'center',
	// 	gap: 7,
	// },
});
