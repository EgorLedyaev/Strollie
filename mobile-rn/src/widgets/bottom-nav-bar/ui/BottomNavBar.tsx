import { BottomNavBarWithCutout } from '@/assets/icons/BottomNavBarWithCutout';
import FeedIcon from '@/assets/icons/FeedIcon';
import MessengerIcon from '@/assets/icons/MessengerIcon';
import NotificationIcon from '@/assets/icons/NotificationIcon';
import ScheduleIcon from '@/assets/icons/ScheduleIcon';
import SettingsIcon from '@/assets/icons/SettingsIcon';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';

import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';

import { RouteToggleButton } from './RouteToggleButton';

// КОНСТАНТЫ
const NAV_BAR_HEIGHT = 72;
const PANEL_HEIGHT = 140;
const TOTAL_HEIGHT = NAV_BAR_HEIGHT + PANEL_HEIGHT;
const SPRING_CONFIG = {
	damping: 15,
	stiffness: 100,
	mass: 0.8,
};

export const BottomNavBar: React.FC = () => {
	const MAX_TRANSLATE_Y = -PANEL_HEIGHT;
	const SNAP_POINT = MAX_TRANSLATE_Y / 2;

	// Shared values
	const translateY = useSharedValue(MAX_TRANSLATE_Y);
	const startY = useSharedValue(0);

	const panGesture = Gesture.Pan()
		.onBegin(() => {
			startY.value = translateY.value;
		})
		.onUpdate(event => {
			let newTranslateY = startY.value + event.translationY;
			// Ограничиваем перетаскивание
			newTranslateY = Math.max(newTranslateY, MAX_TRANSLATE_Y);
			newTranslateY = Math.min(newTranslateY, 0);
			translateY.value = newTranslateY;
		})
		.onEnd(event => {
			// Улучшенная логика прилипания с учетом скорости
			const velocity = event.velocityY;
			const shouldSnapUp =
				translateY.value < SNAP_POINT || velocity < -500;

			if (shouldSnapUp) {
				translateY.value = withSpring(MAX_TRANSLATE_Y, SPRING_CONFIG);
			} else {
				translateY.value = withSpring(0, SPRING_CONFIG);
			}
		});

	// Анимированные стили
	const animatedContainerStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: translateY.value }],
		};
	});
	const [playing, setPlaying] = useState(false);

	// Обработчики нажатий
	const handleNavNotificationPress = () => {
		console.log('Notification pressed');
	};

	const handleNavRoutePress = () => {
		console.log('Route button pressed');
		setPlaying(!playing);
	};

	const handleNavChatPress = () => {
		console.log('Chat pressed');
	};

	return (
		<GestureDetector gesture={panGesture}>
			<Animated.View
				style={[
					styles.container,
					{
						height: TOTAL_HEIGHT,
						bottom: -PANEL_HEIGHT,
					},
					animatedContainerStyle,
				]}
			>
				<View
					style={[styles.navBarContainer, { height: NAV_BAR_HEIGHT }]}
				>
					<BottomNavBarWithCutout />
					<View style={styles.navBarIcons}>
						<IconButton
							style={styles.navBarButton}
							children={<MessengerIcon />}
						/>

						<RouteToggleButton
							isPlaying={playing}
							onPress={handleNavRoutePress}
							style={styles.centerButton}
						/>
						<IconButton
							style={styles.navBarButton}
							onPress={handleNavChatPress}
							children={<NotificationIcon />}
						/>
					</View>
				</View>
				<View style={styles.backgroundBetween} />
				<View style={[styles.panelContainer, { height: PANEL_HEIGHT }]}>
					<View style={styles.panelContent}>
						<IconButton
							children={<FeedIcon />}
							style={styles.panelButton}
						/>
						<AppText style={styles.panelButtonText}>Лента</AppText>
					</View>
					<View style={styles.panelContent}>
						<IconButton
							children={<ScheduleIcon />}
							style={styles.panelButton}
						/>
						<AppText style={styles.panelButtonText}>Афиша</AppText>
					</View>
					<View style={styles.panelContent}>
						<IconButton
							children={<SettingsIcon />}
							style={styles.panelButton}
						/>
						<AppText style={styles.panelButtonText}>
							Настройки
						</AppText>
					</View>
				</View>
			</Animated.View>
		</GestureDetector>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		gap: 5,
	},
	panelContainer: {
		backgroundColor: Colors.white,
		borderTopLeftRadius: Radius.r20,
		borderTopRightRadius: Radius.r20,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		paddingTop: 16,
	},
	panelContent: {
		alignItems: 'center',
		gap: 7,
	},
	navBarContainer: {},
	navBarIcons: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		top: 0,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly',
	},
	navBarButton: {
		width: 40,
		height: 40,
		borderRadius: Radius.r16,
		backgroundColor: Colors.grayBackground,
	},

	centerButton: {
		transform: [{ translateY: -20 }],
	},

	panelButton: {
		width: 80,
		height: 50,
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r16,
	},
	panelButtonText: {
		color: Colors.grayText,
		fontSize: Fonts.f12,
	},

	backgroundBetween: {
		position: 'absolute',
		zIndex: -1,
		left: 0,
		right: 0,
		bottom: 0,
		height: PANEL_HEIGHT + 15,
		backgroundColor: Colors.backgroundBetweenNavbarAndPanel,
	},
});
