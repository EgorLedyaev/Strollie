import walk_image from '@/assets/images/routes/embankment.png';
import run_image from '@/assets/images/routes/sports.png';
import React, { useEffect, useState } from 'react';
import {
	Pressable,
	ScrollView,
	StyleSheet,
	useWindowDimensions,
	View,
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AiMode } from '@/widgets/route-planner/ui/AiMode';
import { ManualMode } from '@/widgets/route-planner/ui/ManualMode';
import { ModeToggle } from '@/widgets/route-planner/ui/ModeToggle';
import { SearchScreen } from '@/widgets/route-planner/ui/SearchScreen';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppButton, BackButton } from '@/shared/ui';

interface RoutePlannerProps {
	isVisible: boolean;
	onClose: () => void;
}
interface RoutePoint {
	id: number;
	address: string;
}

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

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
	isVisible,
	onClose,
}) => {
	const { height } = useWindowDimensions();
	const { top, bottom } = useSafeAreaInsets();
	const translateY = useSharedValue(height);
	const [mode, setMode] = useState<'manual' | 'ai'>('manual');
	const [isSearchVisible, setSearchVisible] = useState(false);
	const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);

	const [isPlacesExpanded, setIsPlacesExpanded] = useState(false);

	const [isEventsExpanded, setIsEventsExpanded] = useState(false);

	const togglePlacesExpansion = () => {
		setIsPlacesExpanded(prevState => !prevState);
	};

	const displayedPlaces = isPlacesExpanded
		? nearbyPlaces.slice(0, 10)
		: nearbyPlaces.slice(0, 2);
	const toggleEventsExpansion = () => {
		setIsEventsExpanded(prevState => !prevState);
	};
	const displayedEvents = isEventsExpanded
		? nearbyEvents.slice(0, 10)
		: nearbyEvents.slice(0, 2);

	const handleRemovePoint = (id: number) => {
		setRoutePoints(prevPoints => prevPoints.filter(p => p.id !== id));
	};

	const handleSelectPoint = (point: { address: string }) => {
		const newPoint: RoutePoint = {
			id: Date.now(), // Уникальный id на основе времени
			address: point.address,
		};
		setRoutePoints(prevPoints => [...prevPoints, newPoint]);
		setSearchVisible(false);
	};

	useEffect(() => {
		translateY.value = withTiming(isVisible ? 0 : height, {
			duration: 350,
		});
	}, [isVisible, height, translateY]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: translateY.value }],
		};
	});

	const handleSwitchModeFromSearch = (newMode: 'manual' | 'ai') => {
		setMode(newMode);
		setSearchVisible(false);
	};

	return (
		<Animated.View
			style={[styles.container, animatedStyle]}
			pointerEvents={isVisible ? 'auto' : 'none'}
		>
			<Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
			<View
				style={[
					styles.widget,
					{ paddingBottom: bottom || 16, top: top + 90 },
				]}
			>
				<ScrollView showsVerticalScrollIndicator={false}>
					<ModeToggle
						activeMode={mode}
						onModeChange={setMode}
						style={styles.modeToggle}
					/>

					{mode === 'manual' ? (
						<ManualMode
							routePoints={routePoints}
							onRemovePoint={handleRemovePoint}
							onAddPoint={() => setSearchVisible(true)}
							displayedPlaces={displayedPlaces}
							isPlacesExpanded={isPlacesExpanded}
							onTogglePlacesExpansion={togglePlacesExpansion}
							displayedEvents={displayedEvents}
							isEventsExpanded={isEventsExpanded}
							onToggleEventsExpansion={toggleEventsExpansion}
						/>
					) : (
						<AiMode />
					)}
				</ScrollView>

				{/* Футер */}
				<View style={styles.footer}>
					<BackButton
						variant='icon'
						onPress={onClose}
						style={styles.backButton}
					/>
					<AppButton
						text={'Построить'}
						style={styles.buildButton}
						textFontFamily={Fonts.bold}
					/>
				</View>
			</View>

			<SearchScreen
				isVisible={isSearchVisible}
				onClose={() => setSearchVisible(false)}
				onSelectPoint={handleSelectPoint}
				currentMode={mode} ///
				onSwitchMode={handleSwitchModeFromSearch}
			/>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	backButton: {
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r16,
		height: 52,
		width: 52,
	},
	buildButton: {
		alignItems: 'center',
		borderRadius: Radius.r16,
		flex: 1,
		height: 52,
	},
	container: {
		...StyleSheet.absoluteFillObject,
		zIndex: 10,
	},
	footer: {
		alignItems: 'center',
		borderTopColor: Colors.grayBackground,
		borderTopWidth: 1,
		flexDirection: 'row',
		gap: 16,
		paddingBottom: 18,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	modeToggle: {
		marginHorizontal: 16,
	},
	widget: {
		backgroundColor: Colors.white,
		borderTopLeftRadius: Radius.r20,
		borderTopRightRadius: Radius.r20,
		bottom: 0,
		left: 0,
		paddingTop: 16,
		position: 'absolute',
		right: 0,
	},
});
