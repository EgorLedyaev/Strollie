import NavBar, { BottomNavBarWithCutout } from '@/assets/icons/BottomNavBarWithCutout';
import { ActiveRouteIcon, StartRouteIcon } from '@/assets/icons/map';
import MessengerIcon from '@/assets/icons/MessengerIcon';
import NotificationIcon from '@/assets/icons/NotificationIcon';
import { usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';





export const BottomNavBar: React.FC = () => {
	const pathname = usePathname();

	const isActive = (path: string) => {
		if (path === '/' && pathname === '/(app)') return true;
		return pathname.startsWith(path);
	};
	const handleNavProfilePress = () => {
		console.log('Profile button pressed');
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
				<MessengerIcon />
				{/* <StartRouteIcon /> */}
				<StartRouteIcon    />
				<NotificationIcon />
			</View>
			<BottomNavBarWithCutout />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
	},
    navBarIcon: {
        flexDirection: 'row',
        // position: 'absolute',
        paddingHorizontal: 20,
        justifyContent: 'space-around',
        paddingBottom: -10,
	},
});