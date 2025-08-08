import BecomeGuideIcon from '@/assets/profile/BecomeGuideIcon';
import CalendarIcon from '@/assets/profile/CalendarIcon';
import RouteIcon from '@/assets/profile/RouteIcon';
import SavedRouteIcon from '@/assets/profile/SavedRouteIcon';
import TicketsIcon from '@/assets/profile/TicketsIcon';
import TravelsIcon from '@/assets/profile/TravelsIcon';
import { Link, type LinkProps } from 'expo-router';
import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Gaps, Radius, Shadows } from '@/shared/tokens';
import { AppText, IconButton } from '@/shared/ui';

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
			<IconButton
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
			</IconButton>
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
	gridItemContainer: {
		flex: 1,
		height: 130,
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		boxShadow: Shadows.boxShadow_elev1,
	},
	gridItemContent: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
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
