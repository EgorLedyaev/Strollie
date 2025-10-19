import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Place } from '@/pages/routes/model/places';
import { RoutesImageCard } from '@/widgets/routes/card';
import { Colors, Fonts } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

interface Props {
	place: Place;
	onToggleFavorite: (placeId: string) => void;
}

export const PlaceCard: React.FC<Props> = ({ place, onToggleFavorite }) => {
	return (
		<RoutesImageCard
			images={place.images}
			isFavorite={place.isFavorite}
			onToggleFavorite={() => onToggleFavorite(place.id)}
		>
			<View style={styles.headerRow}>
				<View>
					<AppText style={styles.title}>{place.title}</AppText>
					<AppText style={styles.category}>{place.category}</AppText>
				</View>
			</View>
			<View style={styles.routeContainer}>
				<AppText style={styles.routeText}>{place.address}</AppText>
			</View>
		</RoutesImageCard>
	);
};

const styles = StyleSheet.create({
	category: {
		color: Colors.secondaryText,
		fontSize: Fonts.f14,
		marginTop: 4,
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
	title: {
		color: Colors.headerAndInputText,
		// fontFamily: Fonts.regular,
		fontSize: Fonts.f20,
	},
});
