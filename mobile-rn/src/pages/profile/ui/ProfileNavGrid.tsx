import CalendarIcon from '@/assets/profile/CalendarIcon';
import RouteIcon from '@/assets/profile/RouteIcon';
import SavedRouteIcon from '@/assets/profile/SavedRouteIcon';
import TicketsIcon from '@/assets/profile/TicketsIcon';
import TravelsIcon from '@/assets/profile/TravelsIcon';
import { Link, type LinkProps } from 'expo-router';
import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Gaps, Radius, Shadows } from '@/shared/tokens';
import { ActionTouchable, AppText } from '@/shared/ui';

import { GridItemBackground } from './GridItemBackground';

interface NavItem {
	id: string;
	title: string;
	icon: React.ReactNode;
	path: LinkProps['href'];
}

// Отдельный компонент для элемента сетки, чтобы управлять его состоянием
const GridItem: React.FC<{ item: NavItem }> = ({ item }) => {
	const [layout, setLayout] = useState<{
		width: number;
		height: number;
	} | null>(null);

	const handleLayout = (event: LayoutChangeEvent) => {
		const { width, height } = event.nativeEvent.layout;
		setLayout({ width, height });
	};

	return (
		<Link href={item.path} asChild>
			<ActionTouchable
				style={styles.gridItemContainer}
				onLayout={handleLayout}
			>
				{/* Слой Фона */}
				{layout && (
					<GridItemBackground
						width={layout.width}
						height={layout.height}
					/>
				)}

				{/* Слой Контента */}
				<View style={styles.gridItemContent}>
					<AppText style={styles.gridText}>{item.title}</AppText>
					<View style={styles.gridIcon}>{item.icon}</View>
				</View>
			</ActionTouchable>
		</Link>
	);
};

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
			title: 'Избранное',
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
		// {
		// 	id: 'become-a-guide',
		// 	title: 'FAQ / Стать гидом',
		// 	icon: <BecomeGuideIcon />,
		// 	path: '/guide',
		// },
	];

	// ... (логика chunkArray остается без изменений)
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
						<GridItem key={item.id} item={item} />
					))}
					{chunk.length === 1 && (
						<View style={styles.gridItemPlaceholder} />
					)}
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	gridContainer: {
		gap: Gaps.g15,
	},
	gridIcon: {
		bottom: 16,
		position: 'absolute',
		right: 16,
	},
	gridItemContainer: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		boxShadow: Shadows.boxShadow_elev1,
		flex: 1,
		height: 130,
	},
	gridItemContent: {
		...StyleSheet.absoluteFillObject,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		padding: 24,
	},
	gridItemPlaceholder: {
		flex: 1,
	},
	gridRow: {
		flexDirection: 'row',
		gap: Gaps.g15,
	},
	gridText: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.semibold,
	},
});
