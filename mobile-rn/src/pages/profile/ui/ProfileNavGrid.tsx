import BecomeGuideIcon from '@/assets/icons/BecomeGuideIcon';
import CalendarIcon from '@/assets/profile/calendar';
import RouteIcon from '@/assets/profile/route';
import SavedRouteIcon from '@/assets/profile/saved-route';
import TicketsIcon from '@/assets/profile/tickets';
import TravelsIcon from '@/assets/profile/travels';
import { Link, type LinkProps } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';



import { Colors, Fonts, Gaps, Radius, Shadows } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';





interface NavItem {
	id: string;
	title: string;
	icon: React.ReactNode;
	path: LinkProps['href'];
}

export const ProfileNavGrid: React.FC = () => {
	const navItems: NavItem[] = [
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
			id: 'saved-routes',
			title: 'Сохраненные маршруты',
			icon: <SavedRouteIcon />,
			path: '/routes/saved',
		},
		{
			id: 'routes-history',
			title: 'История маршрутов',
			icon: <RouteIcon />,
			path: '/routes/history',
		},

		{
			id: 'calendar',
			title: 'Календарь',
			icon: <CalendarIcon />,
			path: '/calendar',
		},
		{
			id: 'become-a-guide',
			title: 'FAQ / Стать гидом',
			icon: <BecomeGuideIcon />,
			path: '/guide',
		},
	];

	const chunkArray = (array: NavItem[], chunkSize: number): NavItem[][] => {
		const chunks: NavItem[][] = [];
		for (let i = 0; i < array.length; i += chunkSize) {
			chunks.push(array.slice(i, i + chunkSize));
		}
		return chunks;
	};

	const navItemChunks = chunkArray(navItems, 2);

	return (
		<View style={styles.gridContainer}>
			{navItemChunks.map((chunk, rowIndex) => (
				<View key={`row-${rowIndex}`} style={styles.gridRow}>
					{chunk.map(item => (
						<Link key={item.id} href={item.path} asChild>
							<IconButton style={styles.gridItemContent}>
								<AppText
									style={styles.gridText}
								>
									{item.title}
								</AppText>
								<View style={styles.gridIcon}>{item.icon}</View>
							</IconButton>
						</Link>
					))}
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	gridContainer: {
		gap: Gaps.g15,
	},
	gridRow: {
		flexDirection: 'row',
		gap: Gaps.g15,
	},
	gridItemContent: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		backgroundColor: Colors.white,
		height: 130,
		borderRadius: Radius.r15,
		boxShadow: Shadows.boxShadow_elev2,
		padding: 24,
	},
	gridText: {
		fontFamily: Fonts.semibold,
		color: Colors.headerAndInputText,
	},
	gridIcon: {
		position: 'absolute',
		right: 16,
		bottom: 16,
	},
});