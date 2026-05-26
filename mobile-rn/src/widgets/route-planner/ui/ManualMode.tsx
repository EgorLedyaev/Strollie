import PlusIcon from '@/assets/icons/action/PlusIcon';
import DeleteIcon from '@/assets/icons/DeleteIcon';
import { GreenPointerIcon } from '@/assets/icons/map';
import walk_image from '@/assets/images/routes/embankment.png';
import run_image from '@/assets/images/routes/sports.png';
import React from 'react';
import {
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
	type ImageSourcePropType,
} from 'react-native';

import { PlaceCard } from '@/widgets/route-planner/ui/PlaceCard';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

const nearbyPlaces = [
	{
		id: '1',
		title: 'Проспект Столыпина',
		type: 'Улица',
		address: 'г. Саратов, ул. пр-т Столыпина',
		isFavourite: false,
		image: walk_image,
	},
	{
		id: '2',
		title: 'Набережная космонавтов',
		type: 'Улица',
		address: 'г. Саратов, ул. Наб. Космонавтов',
		isFavourite: true,
		image: walk_image,
	},
	{
		id: '3',
		title: 'Набережная космонавтов 2',
		type: 'Улица',
		address: 'г. Саратов, ул. Наб. Космонавтов',
		isFavourite: true,
		image: walk_image,
	},
];
const nearbyEvents = [
	{
		id: '1',
		title: 'Саратов - сердце Волги',
		type: 'Фестиваль',
		address: 'г. Саратов, Наб. Космонавтов',
		isFavourite: false,
		image: run_image,
	},
];
interface RoutePoint {
	id: number;
	address: string;
}

interface Place {
	id: string;
	title: string;
	type: string;
	address: string;
	isFavourite: boolean;
	image: ImageSourcePropType;
}

interface ManualModeProps {
	routePoints: RoutePoint[];
	onRemovePoint: (id: number) => void;
	onAddPoint: () => void;

	displayedPlaces: Place[];
	isPlacesExpanded: boolean;
	onTogglePlacesExpansion: () => void;

	displayedEvents: Place[];
	isEventsExpanded: boolean;
	onToggleEventsExpansion: () => void;
}

export const ManualMode: React.FC<ManualModeProps> = ({
	routePoints,
	onRemovePoint,
	onAddPoint,
	displayedPlaces,
	isPlacesExpanded,
	onTogglePlacesExpansion,
	displayedEvents,
	isEventsExpanded,
	onToggleEventsExpansion,
}) => {
	return (
		<>
			<View style={styles.inputContainer}>
				{routePoints.map(point => (
					<View
						key={point.id}
						style={[styles.inputRow, styles.initialPoint]}
					>
						<GreenPointerIcon style={styles.pointer} />

						<AppText style={styles.input}>{point.address}</AppText>
						<TouchableOpacity
							onPress={() => onRemovePoint(point.id)}
						>
							<DeleteIcon />
						</TouchableOpacity>
					</View>
				))}

				<TouchableOpacity style={styles.inputRow} onPress={onAddPoint}>
					<PlusIcon />
					<AppText style={styles.addPointText}>
						Добавить новую точку
					</AppText>
				</TouchableOpacity>
			</View>

			<View style={styles.section}>
				<AppText style={styles.sectionTitle}>Места рядом</AppText>
				<ScrollView
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.cardsContainer}
				>
					{displayedPlaces.map(place => (
						<PlaceCard key={place.id} {...place} />
					))}

					{nearbyPlaces.length > 2 && (
						<TouchableOpacity onPress={onTogglePlacesExpansion}>
							<AppText style={styles.showMore}>
								{isPlacesExpanded
									? 'Скрыть ↑'
									: 'Показать больше ↓'}
							</AppText>
						</TouchableOpacity>
					)}
				</ScrollView>
			</View>

			<View style={styles.section}>
				<AppText style={styles.sectionTitle}>Мероприятия рядом</AppText>
				<ScrollView
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.cardsContainer}
				>
					{displayedEvents.map(event => (
						<PlaceCard key={event.id} {...event} />
					))}

					{nearbyEvents.length > 2 && (
						<TouchableOpacity onPress={onToggleEventsExpansion}>
							<AppText style={styles.showMore}>
								{isEventsExpanded
									? 'Скрыть ↑'
									: 'Показать больше ↓'}
							</AppText>
						</TouchableOpacity>
					)}
				</ScrollView>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	addPointText: {
		color: Colors.lightInputText,
		fontSize: Fonts.f16,
	},
	cardsContainer: {
		gap: 12,
		paddingHorizontal: 26,
	},

	initialPoint: {
		backgroundColor: Colors.white,
		borderColor: Colors.inputBorder,
		borderWidth: 1.5,
	},
	input: {
		color: Colors.lightInputText,
		flex: 1,
		fontSize: Fonts.f16,
		padding: 0,
	},
	inputContainer: {
		gap: 12,
		marginHorizontal: 16,
		marginTop: 20,
	},
	inputRow: {
		alignItems: 'center',
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r16,
		flexDirection: 'row',
		gap: 10,
		height: 48,
		paddingHorizontal: 16,
	},
	pointer: {
		alignSelf: 'flex-end',
	},
	section: {
		marginTop: 24,
	},
	sectionTitle: {
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
		marginBottom: 12,
		marginLeft: 26,
	},
	showMore: {
		color: Colors.lightInputText,
		fontSize: Fonts.f16,
		marginTop: 10,
		textAlign: 'center',
	},
});
