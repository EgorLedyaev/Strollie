import DeleteIcon from '@/assets/icons/DeleteIcon';
import { GreenPointerIcon } from '@/assets/icons/map';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppText, AppTextInput } from '@/shared/ui';

const categoryRows = [
	[
		{ key: 'sights', label: 'Обзорные площадки' },
		{ key: 'museums', label: 'Музеи' },
	],
	[
		{ key: 'parks', label: 'Парки' },
		{ key: 'cafe', label: 'Кафе' },
		{ key: 'embankments', label: 'Набережные' },
	],
];

export const AiMode = () => {
	const [startPoint, setStartPoint] = useState<string>('');
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [criteria, setCriteria] = useState<'time' | 'distance'>('time');
	const [hours, setHours] = useState<string>('');
	const [minutes, setMinutes] = useState<string>('');
	const [comment, setComment] = useState<string>('');

	const [distance, setDistance] = useState<number>(2);

	const handleCategorySelect = (categoryKey: string) => {
		setSelectedCategories(prev =>
			prev.includes(categoryKey)
				? prev.filter(c => c !== categoryKey)
				: [...prev, categoryKey],
		);
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={styles.container}
		>
			<View style={styles.fromRow}>
				<GreenPointerIcon style={styles.pointer} />

				<AppTextInput
					style={styles.input}
					placeholder='Откуда'
					placeholderTextColor={Colors.lightInputText}
					value={startPoint}
					onChangeText={setStartPoint}
				/>
				<TouchableOpacity onPress={() => setStartPoint('')}>
					<DeleteIcon />
				</TouchableOpacity>
			</View>

			{/* Категории */}
			<View style={styles.section}>
				<AppText style={styles.sectionTitle}>
					Выберите категории
				</AppText>

				<View style={styles.categoryContainer}>
					{categoryRows.map((row, rowIndex) => (
						<View key={rowIndex} style={styles.categoryRow}>
							{row.map(category => {
								const isSelected = selectedCategories.includes(
									category.key,
								);
								return (
									<TouchableOpacity
										key={category.key}
										style={[
											styles.categoryChip,
											isSelected &&
												styles.categoryChipSelected,
										]}
										onPress={() =>
											handleCategorySelect(category.key)
										}
									>
										<AppText style={styles.categoryText}>
											{category.label}
										</AppText>
									</TouchableOpacity>
								);
							})}
						</View>
					))}
				</View>
			</View>

			{/* Переключатель */}
			<View style={styles.toggleContainer}>
				<TouchableOpacity
					style={[
						styles.toggleButton,
						criteria === 'time' && styles.toggleButtonActive,
					]}
					onPress={() => setCriteria('time')}
				>
					<AppText
						style={[
							styles.toggleText,
							criteria === 'time' && styles.toggleTextActive,
						]}
					>
						По времени
					</AppText>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.toggleButton,
						criteria === 'distance' && styles.toggleButtonActive,
					]}
					onPress={() => setCriteria('distance')}
				>
					<AppText
						style={[
							styles.toggleText,
							criteria === 'distance' && styles.toggleTextActive,
						]}
					>
						По расстоянию
					</AppText>
				</TouchableOpacity>
			</View>

			{criteria === 'time' ? (
				<View style={styles.timeInputWrapper}>
					<View style={styles.timeInputContainer}>
						<AppTextInput
							style={styles.timeInput}
							keyboardType='number-pad'
							maxLength={2}
							value={hours}
							onChangeText={setHours}
							placeholder='00'
							placeholderTextColor={Colors.headerAndInputText}
						/>
						<AppText style={styles.timeUnitText}>ч.</AppText>
					</View>
					<View style={styles.timeInputContainer}>
						<AppTextInput
							style={styles.timeInput}
							keyboardType='number-pad'
							maxLength={2}
							value={minutes}
							onChangeText={setMinutes}
							placeholder='00'
							placeholderTextColor={Colors.headerAndInputText}
						/>
						<AppText style={styles.timeUnitText}>мин.</AppText>
					</View>
				</View>
			) : (
				<View style={styles.distanceSliderContainer}>
					<View style={styles.sliderWrapper}>
						{/* Подсказка со значением */}
						<View
							style={[
								styles.callout,
								{
									left: `${((distance - 1) / (12 - 1)) * 100}%`, // Динамическое позиционирование
								},
							]}
						>
							<View style={styles.calloutBody}>
								<AppText style={styles.calloutText}>
									{Math.round(distance)} км
								</AppText>
							</View>
							<View style={styles.calloutTriangle} />
						</View>
						<LinearGradient
							colors={['#1BEE88', '#E5F041', '#FF5900']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={styles.gradientTrack}
						/>
						{/* Слайдер */}
						<View
							style={[
								styles.thumb,
								{
									left: `${((distance - 1) / (12 - 1)) * 100}%`,
								},
							]}
						/>
						<Slider
							style={styles.slider}
							minimumValue={1}
							maximumValue={12}
							step={1}
							value={distance}
							onValueChange={setDistance}
							minimumTrackTintColor='transparent'
							maximumTrackTintColor='transparent'
							thumbTintColor={Colors.transparent}
						/>
					</View>
					<View style={styles.labelsContainer}>
						<AppText style={styles.labelText}>1 км</AppText>
						<AppText style={styles.labelText}>12 км</AppText>
					</View>
				</View>
			)}

			{/* Комментарий */}
			<View style={styles.section}>
				<AppText style={styles.sectionTitle}>
					Комментарий к маршруту
				</AppText>
				<AppTextInput
					style={styles.commentInput}
					placeholder='Опишите, что включить или исключить при создании маршрута'
					placeholderTextColor={Colors.placeHolderInput}
					multiline
					value={comment}
					onChangeText={setComment}
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	callout: {
		alignItems: 'center',
		position: 'absolute',
		top: -35,
		transform: [{ translateX: -24 }],
	},
	calloutBody: {
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r8,
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	calloutText: {
		color: Colors.secondaryText,
		fontSize: Fonts.f12,
	},
	calloutTriangle: {
		backgroundColor: Colors.transparent,
		borderLeftColor: Colors.transparent,
		borderLeftWidth: 6,
		borderRightColor: Colors.transparent,
		borderRightWidth: 6,
		borderStyle: 'solid',
		borderTopColor: Colors.grayBackground,
		borderTopWidth: 8,
		marginTop: -1,
	},
	categoryChip: {
		alignItems: 'center',
		backgroundColor: Colors.uploadButtonBackground,
		borderRadius: Radius.r16,
		flex: 1,
		height: 110,
		justifyContent: 'flex-end',
		paddingHorizontal: 10,
		paddingVertical: 12,
	},
	categoryChipSelected: {
		borderColor: Colors.greenPrimary,
		borderWidth: 1.5,
	},
	categoryContainer: {
		gap: 12,
	},
	categoryRow: {
		flexDirection: 'row',
		gap: 12,
	},
	categoryText: {
		color: Colors.textAAA,
		fontSize: Fonts.f14,
		textAlign: 'center',
	},
	commentInput: {
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r16,
		borderWidth: 1,
		fontSize: Fonts.f16,
		height: 100,
		padding: 16,
		textAlignVertical: 'top',
	},
	container: {
		paddingBottom: 20,
		paddingHorizontal: 16,
	},
	distanceSliderContainer: {
		paddingHorizontal: 16,
		paddingTop: 48,
	},
	fromRow: {
		alignItems: 'center',
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r16,
		borderWidth: 1.5,
		flexDirection: 'row',
		gap: 12,
		height: 52,
		marginTop: 16,
		paddingHorizontal: 16,
	},
	gradientTrack: {
		borderRadius: Radius.r8,
		height: 12,
	},
	input: {
		color: Colors.lightInputText,
		flex: 1,
		fontSize: Fonts.f16,
	},
	labelText: {
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
	},
	labelsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 8,
		paddingTop: 2,
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
		marginBottom: 16,
		paddingLeft: 10,
	},
	slider: {
		height: 40,
		position: 'absolute',
		width: '100%',
	},
	sliderWrapper: {
		height: 40,
		justifyContent: 'center',
	},
	thumb: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r20,
		boxShadow: Shadows.boxShadow,
		height: 32,
		position: 'absolute',
		transform: [{ translateX: -16 }],
		width: 32,
	},
	timeInput: {
		fontFamily: Fonts.medium,
		fontSize: Fonts.f24,
	},
	timeInputContainer: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		flex: 1,
		flexDirection: 'row',
		height: 52,
		justifyContent: 'center',
		paddingHorizontal: 20,
	},
	timeInputWrapper: {
		alignItems: 'center',
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r20,
		flexDirection: 'row',
		gap: 11,
		height: 65,
		marginTop: 12,
		padding: 5,
	},
	timeUnitText: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f24,
		paddingLeft: 12,
	},
	toggleButton: {
		alignItems: 'center',
		borderRadius: Radius.r100,
		flex: 1,
		justifyContent: 'center',
	},
	toggleButtonActive: {
		backgroundColor: Colors.white,
	},
	toggleContainer: {
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r100,
		flexDirection: 'row',
		height: 46,
		marginTop: 24,
		padding: 4,
	},
	toggleText: {
		color: Colors.secondaryText,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
	},
	toggleTextActive: {
		color: Colors.headerAndInputText,
	},
});
