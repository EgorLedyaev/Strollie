import PlusIcon from '@/assets/icons/action/PlusIcon';
import FilterIcon from '@/assets/icons/FilterIcon';
import StarIcon from '@/assets/icons/StarIcon';
import WalkIcon from '@/assets/icons/WalkIcon';
import oreo from '@/assets/images/routes/oreo.png';
import React from 'react';
import {
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ModeToggle } from '@/widgets/route-planner/ui/ModeToggle';
import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppText, AppTextInput, BackButton } from '@/shared/ui';

const previousQueries = [
	{ id: 1, text: 'пр. Имени Петра Столыпина, 77' },
	{ id: 2, text: 'Ильинский пр-д, 10' },
	{ id: 3, text: 'Советская, 99' },
];

const suggestions = [
	{
		id: 1,
		title: 'MetroFitness',
		type: 'Спортзал',
		rating: 4.9,
		distance: '1.5 км',
		address: 'ул. Вавилова, зд. 19',
		image: oreo,
	},
	{
		id: 2,
		title: 'Максюта',
		type: 'Спортзал',
		rating: 3.9,
		distance: '1.5 км',
		address: 'ул. Вавилова, зд. 19',
		image: oreo,
	},
	{
		id: 3,
		title: 'Дворец Спорта',
		type: 'Спортзал',
		rating: 2.9,
		distance: '1.5 км',
		address: 'ул. Вавилова, зд. 19',
		image: oreo,
	},
];

const filterChips = ['Мое местоположение', 'Поесть', 'Прогуляться'];

interface SearchScreenProps {
	isVisible: boolean;
	onClose: () => void;
	onSelectPoint: (point: { address: string }) => void;
	currentMode: 'manual' | 'ai';
	onSwitchMode: (mode: 'manual' | 'ai') => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
	isVisible,
	onClose,
	onSelectPoint,
	currentMode,
	onSwitchMode,
}) => {
	const { height } = useWindowDimensions();
	const { top, bottom } = useSafeAreaInsets();
	const translateY = useSharedValue(height);

	React.useEffect(() => {
		translateY.value = withTiming(isVisible ? 0 : height, {
			duration: 350,
		});
	}, [isVisible, height, translateY]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	return (
		<Animated.View
			style={[styles.container, animatedStyle]}
			pointerEvents={isVisible ? 'auto' : 'none'}
		>
			<Pressable style={StyleSheet.absoluteFill} />
			<View
				style={[
					styles.widget,
					{
						top: top + 90,
						paddingBottom: bottom || 16,
					},
				]}
			>
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContent}
				>
					<ModeToggle
						activeMode={currentMode}
						onModeChange={onSwitchMode}
						style={styles.modeToggle}
					/>
					{/* Header */}
					<View style={styles.header}>
						<BackButton
							variant='icon'
							onPress={onClose}
							style={styles.backButton}
						/>
						<AppTextInput
							placeholder='Введите адрес'
							style={styles.searchInput}
							placeholderTextColor={Colors.lightInputText}
						/>
					</View>

					{/* Filters */}
					<View style={styles.filtersContainer}>
						<TouchableOpacity style={styles.filterButton}>
							<FilterIcon />
						</TouchableOpacity>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.chipsContainer}
						>
							{filterChips.map(chip => (
								<TouchableOpacity
									key={chip}
									style={styles.chip}
								>
									<AppText style={styles.chipText}>
										{chip}
									</AppText>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>

					{/* Предыдущие запросы */}
					<View style={styles.section}>
						<AppText style={styles.sectionTitle}>
							Предыдущие запросы:
						</AppText>
						{previousQueries.map(query => (
							<TouchableOpacity
								key={query.id}
								style={styles.queryItem}
								onPress={() =>
									onSelectPoint({ address: query.text })
								}
							>
								<PlusIcon />
								<AppText style={styles.queryText}>
									{query.text}
								</AppText>
							</TouchableOpacity>
						))}
					</View>

					{/* Карточки */}
					<View style={styles.section}>
						<AppText style={styles.sectionTitle}>
							Вам может понравиться
						</AppText>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.suggestionsContainer}
							style={styles.suggestionsScrollView}
						>
							{suggestions.map(item => {
								const ratingColor =
									item.rating > 4
										? Colors.greenPrimary
										: item.rating > 3
											? Colors.yellow
											: Colors.red;
								return (
									<TouchableOpacity
										key={item.id}
										style={styles.suggestionCard}
										onPress={() =>
											onSelectPoint({
												address: item.title,
											})
										}
									>
										<Image
											source={item.image}
											style={styles.suggestionImage}
										/>
										<View
											style={
												styles.suggestionTextContainer
											}
										>
											<AppText
												style={styles.suggestionTitle}
											>
												{item.title}
											</AppText>
											<AppText
												style={styles.suggestionType}
											>
												{item.type}
											</AppText>
											<AppText
												style={styles.suggestionAddress}
											>
												{item.address}
											</AppText>
											<View style={styles.footerRow}>
												<View style={styles.footerItem}>
													<StarIcon
														color={ratingColor}
													/>
													<AppText
														style={[
															styles.footerText,
															{
																color: ratingColor,
															},
														]}
													>
														{item.rating}
													</AppText>
												</View>

												<View style={styles.footerItem}>
													<WalkIcon />
													<AppText
														style={
															styles.footerText
														}
													>
														{item.distance}
													</AppText>
												</View>
											</View>
										</View>
									</TouchableOpacity>
								);
							})}
						</ScrollView>
					</View>
				</ScrollView>
			</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	backButton: {
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r16,
		height: 44,
		width: 44,
	},
	chip: {
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r12,
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
	chipText: { color: Colors.secondaryText, fontSize: Fonts.f14 },
	chipsContainer: { gap: 8 },
	container: { ...StyleSheet.absoluteFillObject, zIndex: 20 },
	filterButton: {
		alignItems: 'center',
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r12,
		height: 40,
		justifyContent: 'center',
		width: 48,
	},
	filtersContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 12,
		marginBottom: 24,
	},
	footerItem: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 6,
	},
	footerRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 12,
		paddingTop: 8,
	},
	footerText: {
		fontSize: Fonts.f10,
	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 12,
		marginBottom: 16,
	},
	modeToggle: {
		marginBottom: 24,
	},
	queryItem: {
		alignItems: 'center',
		borderColor: Colors.inputOptionBorder,
		borderRadius: Radius.r15,
		borderWidth: 1.5,
		flexDirection: 'row',
		gap: 12,
		marginBottom: 8,
		paddingHorizontal: 20,
		paddingVertical: 14,
	},
	queryText: {
		color: Colors.secondaryText,
		fontSize: Fonts.f16,
	},
	scrollContent: {
		paddingBottom: 50,
		paddingHorizontal: 16,
	},
	searchInput: {
		borderColor: Colors.grayBackground,
		borderRadius: Radius.r15,
		borderWidth: 1.5,
		flex: 1,
		height: 48,
		paddingHorizontal: 20,
	},
	section: {
		marginBottom: 12,
	},
	sectionTitle: {
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
		marginBottom: 16,
		paddingHorizontal: 16,
	},
	suggestionAddress: { color: Colors.secondaryText, fontSize: Fonts.f10 },
	suggestionCard: {
		backgroundColor: Colors.white,
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r16,
		boxShadow: Shadows.boxShadow,
		height: 214,
		width: 140,
	},
	suggestionImage: {
		borderRadius: Radius.r8,
		height: 117,
		margin: 12,
		width: 117,
	},
	suggestionTextContainer: { paddingHorizontal: 12 },
	suggestionTitle: {
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f14,
		marginBottom: 4,
	},
	suggestionType: {
		color: Colors.secondaryText,
		fontSize: Fonts.f10,
		marginBottom: 6,
	},
	suggestionsContainer: {
		gap: 20,
		padding: 10,
	},
	suggestionsScrollView: {
		margin: -10,
	},
	widget: {
		backgroundColor: Colors.white,
		borderTopLeftRadius: Radius.r20,
		borderTopRightRadius: Radius.r20,
		bottom: 0,
		height: '95%',
		left: 0,
		paddingTop: 16,
		position: 'absolute',
		right: 0,
	},
});
