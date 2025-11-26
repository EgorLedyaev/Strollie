import ArrowRightIcon from '@/assets/icons/ArrowRightIcon';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Route } from '@/pages/routes/model/routes';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

import { RoutesImageCard } from '../RoutesImageCard';

const formatDate = (isoString: string): string => {
	return format(parseISO(isoString), 'dd.MM.yyyy', { locale: ru });
};

interface Props {
	route: Route;
	onToggleFavorite: (routeId: string) => void;
}

export const RouteCard: React.FC<Props> = ({ route, onToggleFavorite }) => {
	return (
		<RoutesImageCard
			images={route.images}
			isFavorite={route.isFavorite}
			onToggleFavorite={() => onToggleFavorite(route.id)}
		>
			<View style={styles.headerRow}>
				<View>
					<AppText style={styles.title}>{route.title}</AppText>
					<AppText style={styles.date}>
						{formatDate(route.date)}
					</AppText>
				</View>
				<View style={styles.statsContainer}>
					<AppText
						style={[
							styles.distance,
							{ color: Colors.greenPrimary },
						]}
					>
						{route.distance}
					</AppText>
					<AppText style={styles.duration}>{route.duration}</AppText>
				</View>
			</View>
			<View style={styles.routeContainer}>
				<AppText style={styles.routeText}>
					{'из ' + route.startPoint}
				</AppText>
				<ArrowRightIcon />
				<AppText style={styles.routeText}>
					{'в ' + route.endPoint}
				</AppText>
			</View>
			<View style={styles.tagsContainer}>
				{route.tags.map((tag, index) => (
					<View key={index} style={styles.tag}>
						<AppText style={styles.tagText}>{'#' + tag}</AppText>
					</View>
				))}
			</View>
		</RoutesImageCard>
	);
};

const styles = StyleSheet.create({
	date: {
		color: Colors.secondaryText,
		fontSize: Fonts.f14,
		marginTop: 4,
	},
	distance: {
		fontSize: Fonts.f14,
	},
	duration: {
		color: Colors.lightInputText,
		fontSize: Fonts.f14,
		marginTop: 8,
	},
	headerRow: {
		alignItems: 'flex-start',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	routeContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 8,
		marginBottom: 20,
	},
	routeText: {
		color: Colors.secondaryText,
		fontSize: Fonts.f14,
	},
	statsContainer: {
		alignItems: 'flex-end',
		gap: 8,
	},
	tag: {
		backgroundColor: Colors.successGreen,
		borderRadius: Radius.r12,
		paddingHorizontal: 16,
		paddingVertical: 6,
	},
	tagText: {
		color: Colors.white,
		fontSize: Fonts.f14,
	},
	tagsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
	},
	title: {
		color: Colors.headerAndInputText,
		// fontFamily: Fonts.regular,
		fontSize: Fonts.f20,
	},
});
