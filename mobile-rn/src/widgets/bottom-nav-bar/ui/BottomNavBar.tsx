import { BottomNavBarWithCutout } from '@/assets/icons/BottomNavBarWithCutout';
import { StartRouteIcon } from '@/assets/icons/map';
import MessengerIcon from '@/assets/icons/MessengerIcon';
import NotificationIcon from '@/assets/icons/NotificationIcon';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export const BottomNavBar: React.FC = () => {
	const handleNavNotificationPress = () => {
		console.log('Notification button pressed');
	};

	const handleBuildRouteThroughPlaced = () => {
		console.log('Build route through placed called');
	};

	const handleNavRoutePress = () => {
		handleBuildRouteThroughPlaced();
	};

	const handleNavChatPress = () => {
		console.log('Chat button pressed');
	};

	return (
		<View style={styles.container}>
			<View style={styles.navBarIcon}>
				<Pressable onPress={handleNavChatPress}>
					<MessengerIcon />
				</Pressable>
				<Pressable onPress={handleNavRoutePress}>
					<StartRouteIcon />
				</Pressable>
				<Pressable onPress={handleNavNotificationPress}>
					<NotificationIcon />
				</Pressable>
			</View>
			<BottomNavBarWithCutout />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {},
	navBarIcon: {
		flexDirection: 'row',
		// position: 'absolute',
		paddingHorizontal: 20,
		justifyContent: 'space-around',
		paddingBottom: 0,
	},
});
