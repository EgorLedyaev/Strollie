import CheckmarkIconSmall from '@/assets/icons/CheckmarkIconSmall';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppButton, AppText, SectionItem } from '@/shared/ui';

type GradientCircleProps = {
	style?: ViewStyle;
};

export const GradientCircle: React.FC<GradientCircleProps> = ({ style }) => {
	return (
		<LinearGradient
			// Направления градиента (сверху вниз)
			start={{ x: 0.5, y: 0 }}
			end={{ x: 0.5, y: 1 }}
			// Цвета градиента
			colors={['#1BF57E', '#12DFBA']} // Яркий зеленый -> темный зеленый
			style={[styles.circle, style]}
		/>
	);
};

export type Place = {
	id: string;
	name: string;
	visited?: boolean;
};

type PlacesSectionProps = {
	places: Place[];
	mode: 'view' | 'route';
	selectedIds: string[];
	onBuildRouteClick: () => void;
	onPlaceSelect: (id: string) => void;
};

export const PlacesSection: React.FC<PlacesSectionProps> = ({
	places,
	mode,
	selectedIds,
	onBuildRouteClick,
	onPlaceSelect,
}) => {
	const router = useRouter();

	return (
		<View>
			<SectionItem
				label={'Места'}
				onPress={() => router.push('/trips/add-place')}
			/>
			<View style={styles.section}>
				<View style={styles.placesBox}>
					{mode === 'view' ? (
						// режим просмотра (с точками)
						<>
							<View style={styles.placesLine} />
							{places.map(p => (
								<View style={styles.placeRow} key={p.id}>
									{p.visited ? (
										<GradientCircle
											style={styles.placeDot}
										/>
									) : (
										<View
											style={[
												styles.placeDot,
												styles.placeDotDefault,
											]}
										/>
									)}
									<AppText
										style={
											p.visited
												? [
														styles.placeText,
														styles.placeTextVisited,
													]
												: styles.placeText
										}
									>
										{p.name}
									</AppText>
								</View>
							))}
						</>
					) : (
						// режим выбора маршрута (с чекбоксами)
						<View>
							{places.map(p => {
								const isSelected = selectedIds.includes(p.id);
								return (
									<Pressable
										style={styles.placeRow}
										key={p.id}
										onPress={() => onPlaceSelect(p.id)}
									>
										<View
											style={
												isSelected
													? styles.checkboxChecked
													: styles.checkbox
											}
										>
											{isSelected ? (
												<CheckmarkIconSmall />
											) : (
												<CheckmarkIconSmall
													color={Colors.grayMedium}
												/>
											)}
										</View>
										<AppText style={styles.placeText}>
											{p.name}
										</AppText>
									</Pressable>
								);
							})}
						</View>
					)}
				</View>
				<AppButton
					text='Построить маршрут'
					variant='secondary'
					style={styles.buildRouteButton}
					buttonBorderRadius={Radius.r16}
					buttonColor={Colors.white}
					textColor={Colors.successGreen}
					onPress={onBuildRouteClick}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	buildRouteButton: {
		height: 44,
	},
	checkbox: {
		alignItems: 'center',
		borderColor: Colors.grayMedium,
		borderRadius: Radius.r15,
		borderWidth: 2,
		height: 20,
		justifyContent: 'center',
		width: 20,
	},
	checkboxChecked: {
		alignItems: 'center',
		backgroundColor: Colors.greenPrimary,
		borderColor: Colors.greenPrimary,
		borderRadius: Radius.r15,
		borderWidth: 2,
		height: 20,
		justifyContent: 'center',
		width: 20,
	},
	circle: {
		// Общие стили для всех кружков, размер можно передавать через style
		borderRadius: Radius.r16, // половина от ширины/высоты
		height: 20,
		width: 20,
	},
	placeDot: {
		borderRadius: Radius.r10,
		height: 20,
		width: 20,
		zIndex: 1,
	},
	placeDotDefault: {
		backgroundColor: Colors.lightInputText,
	},
	placeRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 20,
		marginVertical: 10,
	},
	placeText: {
		color: Colors.headerAndInputText,
		flex: 1,
		fontSize: Fonts.f16,
	},
	placeTextVisited: {
		color: Colors.grayMedium,
	},
	placesBox: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		paddingHorizontal: 24,
		paddingVertical: 20,
		position: 'relative',
	},
	placesLine: {
		backgroundColor: Colors.noPhotoIconBackground,
		borderRadius: Radius.r5,
		bottom: 20,
		left: 31,
		position: 'absolute',
		top: 20,
		width: 7,
	},
	section: {
		gap: Gaps.g12,
	},
});
