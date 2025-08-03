// Импортируем иконки для навигационной сетки
import CalendarIcon from '@/assets/profile/calendar';
import RouteIcon from '@/assets/profile/route';
import SavedRouteIcon from '@/assets/profile/saved-route';
import TicketsIcon from '@/assets/profile/tickets';
import TravelsIcon from '@/assets/profile/travels';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/src/shared/tokens';
import { AppText, Card } from '@/src/shared/ui';

interface NavItem {
	id: string;
	title: string;
	icon: React.ReactNode;
	path: string;
}

export const ProfileNavGrid: React.FC = () => {
	const navItems: NavItem[] = [
		{
			id: 'calendar',
			title: 'Мой календарь',
			icon: <CalendarIcon />,
			path: '/calendar',
		},
		{
			id: 'tickets',
			title: 'Мои билеты',
			icon: <TicketsIcon />,
			path: '/tickets',
		},
		{
			id: 'trips',
			title: 'Мои поездки',
			icon: <TravelsIcon />,
			path: '/trips',
		},
		{
			id: 'routes-history',
			title: 'История маршрутов',
			icon: <RouteIcon />,
			path: '/routes/history',
		},
		{
			id: 'saved-routes',
			title: 'Сохраненные маршруты',
			icon: <SavedRouteIcon />,
			path: '/routes/saved',
		},
	];

	return (
		<View style={styles.container}>
			<Card style={styles.grid}>
				{navItems.map(item => (
					<Link key={item.id} href={item.path} asChild>
						<TouchableOpacity style={styles.navItem}>
							<View style={styles.iconContainer}>
								{item.icon}
							</View>
							<AppText style={styles.navText}>
								{item.title}
							</AppText>
						</TouchableOpacity>
					</Link>
				))}
			</Card>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 16,
		marginTop: 8,
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		padding: 16,
	},
	navItem: {
		width: '48%',
		backgroundColor: Colors.lightBackground,
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		alignItems: 'center',
	},
	iconContainer: {
		marginBottom: 12,
	},
	navText: {
		fontSize: 14,
		textAlign: 'center',
		color: Colors.headerAndInputText,
	},
});
