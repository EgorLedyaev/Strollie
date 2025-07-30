// src/features/map/ui/EditableRoutePointsList.tsx
import { PlacedMarkerData } from '@/src/entities/marker';
// Обязательно для DraggableFlatList!
import { Colors, Fonts, Gaps, Radius } from '@/src/shared/tokens';
import React from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import DraggableFlatList, {
	OpacityDecorator,
	RenderItemParams,
	ScaleDecorator,
	ShadowDecorator,
} from 'react-native-draggable-flatlist';

// Убедись, что тип импортируется

interface EditableRoutePointsListProps {
	points: PlacedMarkerData[];
	onReorder: (newOrder: PlacedMarkerData[]) => void;
	onDeletePoint: (markerId: string) => void;
	onDeleteAll: () => void;
	isVisible: boolean;
	onClose: () => void;
}

export const EditableRoutePointsList: React.FC<
	EditableRoutePointsListProps
> = ({ points, onReorder, onDeletePoint, onDeleteAll, isVisible, onClose }) => {
	if (!isVisible) {
		return null;
	}

	const renderItem = ({
		item,
		drag,
		isActive,
	}: RenderItemParams<PlacedMarkerData>) => {
		return (
			<ScaleDecorator>
				<OpacityDecorator activeOpacity={0.5}>
					<ShadowDecorator>
						<TouchableOpacity
							onLongPress={drag} // Долгое нажатие для начала перетаскивания
							disabled={isActive} // Отключаем во время активного перетаскивания этого элемента
							style={[
								styles.itemContainer,
								isActive && styles.itemActive, // Стиль для перетаскиваемого элемента
							]}
						>
							<View style={styles.dragHandle}>
								<Text style={styles.dragHandleText}>⠿</Text>
							</View>
							<Text
								style={styles.itemText}
								numberOfLines={1}
								ellipsizeMode='tail'
							>
								{/* Точка {points.findIndex(p => p.id === item.id) + 1}: {item.id.substring(0, 4)}... */}
								{item.coordinates[1].toFixed(3)},{' '}
								{item.coordinates[0].toFixed(3)}
							</Text>
							<TouchableOpacity
								onPress={() => onDeletePoint(item.id)}
								style={styles.deleteButton}
							>
								<Text style={styles.deleteButtonText}>✕</Text>
							</TouchableOpacity>
						</TouchableOpacity>
					</ShadowDecorator>
				</OpacityDecorator>
			</ScaleDecorator>
		);
	};

	return (
		// Обертка GestureHandlerRootView важна для корректной работы gesture-handler
		// Если она уже есть на верхнем уровне экрана (MapScreen), здесь может быть не нужна.
		// Но для изолированного компонента лучше добавить.
		<View style={styles.panelContainer}>
			<View style={styles.headerRow}>
				<Text style={styles.panelTitle}>Точки маршрута</Text>
				<TouchableOpacity
					onPress={onClose}
					style={styles.closeButtonPanel}
				>
					<Text style={styles.closeButtonPanelText}>✕</Text>
				</TouchableOpacity>
			</View>
			{points.length === 0 ? (
				<Text style={styles.emptyText}>
					Добавьте точки долгим нажатием на карту
				</Text>
			) : (
				<DraggableFlatList
					data={points}
					onDragEnd={({ data }) => {
						onReorder(data);
					}}
					keyExtractor={item => `draggable-item-${item.id}`} // Ключ должен быть уникальным
					renderItem={renderItem}
					containerStyle={styles.listContainer}
				/>
			)}
			{points.length > 0 && (
				<TouchableOpacity
					onPress={onDeleteAll}
					style={styles.deleteAllButton}
				>
					<Text style={styles.deleteAllButtonText}>
						Удалить все ({points.length})
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	panelContainer: {
		position: 'absolute',
		bottom: Platform.OS === 'ios' ? 120 : 100,
		left: 10,
		right: 10,
		backgroundColor: Colors.white,
		borderRadius: Radius.r20,
		padding: Gaps.g16,
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 5,
		elevation: 8,
		zIndex: 20, // Выше панели настроек
	},
	headerRow: {
		/* ... как было ... */ flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: Gaps.g16,
	},
	panelTitle: {
		/* ... как было ... */ fontSize: Fonts.f18,
		fontFamily: Fonts.semibold,
		color: Colors.black,
		flex: 1,
		textAlign: 'center',
	},
	closeButtonPanel: {
		/* ... как было ... */ padding: 8,
	},
	closeButtonPanelText: {
		/* ... как было ... */ fontSize: Fonts.f20,
		fontFamily: Fonts.semibold,
		color: Colors.darkGray,
	},
	listContainer: {
		// Если нужно, чтобы список скроллился внутри панели
		// maxHeight: 200, // Например
	},
	itemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.lightBackground,
		marginBottom: Gaps.g8,
		borderRadius: Radius.r10,
		paddingVertical: Gaps.g8,
		paddingHorizontal: Gaps.g8,
	},
	itemActive: {
		backgroundColor: Colors.gray,
		transform: [{ scale: 1.05 }], // Немного увеличить при перетаскивании
	},
	dragHandle: {
		paddingHorizontal: Gaps.g8,
		paddingVertical: Gaps.g8,
		marginRight: Gaps.g8,
	},
	dragHandleText: {
		fontSize: Fonts.f20,
		color: Colors.darkGray,
	},
	itemText: {
		flex: 1, // Чтобы текст занимал доступное место и мог переноситься
		fontSize: Fonts.f14,
		fontFamily: Fonts.regular,
		color: Colors.black,
	},
	deleteButton: {
		padding: Gaps.g8,
		marginLeft: Gaps.g8,
	},
	deleteButtonText: {
		/* ... как было ... */ color: Colors.red,
		fontSize: Fonts.f18,
		fontFamily: Fonts.semibold,
	},
	emptyText: {
		/* ... как было ... */ textAlign: 'center',
		fontSize: Fonts.f16,
		color: Colors.darkGray,
		paddingVertical: Gaps.g20,
	},
	deleteAllButton: {
		/* ... как было ... */ marginTop: Gaps.g16,
		backgroundColor: Colors.red,
		paddingVertical: 12,
		paddingHorizontal: Gaps.g16,
		borderRadius: Radius.r10,
		alignItems: 'center',
	},
	deleteAllButtonText: {
		/* ... как было ... */ color: Colors.white,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
	},
});
