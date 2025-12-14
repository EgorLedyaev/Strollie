import DeleteIcon from '@/assets/icons/DeleteIcon';
import { GreenPointerIcon } from '@/assets/icons/map';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText, AppTextInput } from '@/shared/ui';

interface AiModeProps {
	startPoint: string;
	onStartPointChange: (value: string) => void;
	onStartPointBlur: () => void;
	onClearStartPoint: () => void;
	onUseMyLocation: () => void;
	startPointError?: string | null;
	categories: { id: string; label: string }[];
	selectedCategories: string[];
	onToggleCategory: (id: string) => void;
	hours: string;
	onHoursChange: (value: string) => void;
	minutes: string;
	onMinutesChange: (value: string) => void;
	comment: string;
	onCommentChange: (value: string) => void;
	isCategoriesLoading?: boolean;
	isGeocoding?: boolean;
}

export const AiMode = ({
	startPoint,
	onStartPointChange,
	onStartPointBlur,
	onClearStartPoint,
	onUseMyLocation,
	startPointError,
	categories = [],
	selectedCategories = [],
	onToggleCategory,
	hours,
	onHoursChange,
	minutes,
	onMinutesChange,
	comment,
	onCommentChange,
	isCategoriesLoading,
	isGeocoding,
}: AiModeProps) => {
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
					onChangeText={onStartPointChange}
					onBlur={onStartPointBlur}
				/>
				<TouchableOpacity
					onPress={onUseMyLocation}
					style={styles.inlineButton}
					disabled={isGeocoding}
				>
					<AppText style={styles.inlineButtonText}>
						{isGeocoding ? '...' : 'Моё местоп.'}
					</AppText>
				</TouchableOpacity>
				<TouchableOpacity onPress={onClearStartPoint}>
					<DeleteIcon />
				</TouchableOpacity>
			</View>
			{startPointError ? (
				<AppText style={styles.errorText}>{startPointError}</AppText>
			) : null}

			{/* Категории */}
			<View style={styles.section}>
				<AppText style={styles.sectionTitle}>
					Выберите категории
				</AppText>

				<View style={styles.categoryContainer}>
					{categories.length === 0 && !isCategoriesLoading ? (
						<AppText style={styles.placeholderText}>
							Категории пока недоступны
						</AppText>
					) : (
						categories.map(category => {
							const isSelected = selectedCategories.includes(
								category.label,
							);
							return (
								<TouchableOpacity
									key={category.id}
									style={[
										styles.categoryChip,
										isSelected &&
											styles.categoryChipSelected,
									]}
									onPress={() =>
										onToggleCategory(category.label)
									}
								>
									<AppText style={styles.categoryText}>
										{category.label}
									</AppText>
								</TouchableOpacity>
							);
						})
					)}
				</View>
			</View>

			<AppText style={[styles.sectionTitle, styles.timeTitle]}>
				Время прохождения маршрута
			</AppText>
			<View style={styles.timeInputWrapper}>
				<View style={styles.timeInputContainer}>
					<AppTextInput
						style={styles.timeInput}
						keyboardType='number-pad'
						maxLength={2}
						value={hours}
						onChangeText={onHoursChange}
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
						onChangeText={onMinutesChange}
						placeholder='00'
						placeholderTextColor={Colors.headerAndInputText}
					/>
					<AppText style={styles.timeUnitText}>мин.</AppText>
				</View>
			</View>

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
					onChangeText={onCommentChange}
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	categoryChip: {
		alignItems: 'center',
		backgroundColor: Colors.uploadButtonBackground,
		borderRadius: Radius.r16,
		flexBasis: '48%',
		justifyContent: 'center',
		paddingHorizontal: 10,
		paddingVertical: 12,
	},
	categoryChipSelected: {
		borderColor: Colors.greenPrimary,
		borderWidth: 1.5,
	},
	categoryContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
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
		paddingTop: 24,
	},
	errorText: {
		color: Colors.error,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f12,
		marginTop: 6,
		paddingLeft: 10,
	},
	fromRow: {
		alignItems: 'center',
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r16,
		borderWidth: 1.5,
		flexDirection: 'row',
		height: 52,
		paddingHorizontal: 20,
	},
	inlineButton: {
		marginHorizontal: 8,
	},
	inlineButtonText: {
		color: Colors.greenPrimary,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f12,
	},
	input: {
		flex: 1,
		fontSize: Fonts.f16,
	},
	placeholderText: {
		color: Colors.secondaryText,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f14,
		paddingHorizontal: 4,
	},
	pointer: {
		alignSelf: 'center',
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
		// marginTop: 12,
		padding: 5,
	},
	timeTitle: {
		marginBottom: 12,
		marginTop: 16,
	},
	timeUnitText: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f24,
		paddingLeft: 12,
	},
	// toggleButton: {
	// 	alignItems: 'center',
	// 	borderRadius: Radius.r100,
	// 	flex: 1,
	// 	justifyContent: 'center',
	// },
	// toggleButtonActive: {
	// 	backgroundColor: Colors.white,
	// },
	// toggleContainer: {
	// 	backgroundColor: Colors.grayBackground,
	// 	borderRadius: Radius.r100,
	// 	flexDirection: 'row',
	// 	height: 46,
	// 	marginTop: 24,
	// 	padding: 4,
	// },
	// toggleText: {
	// 	color: Colors.secondaryText,
	// 	fontFamily: Fonts.semibold,
	// 	fontSize: Fonts.f16,
	// },
	// toggleTextActive: {
	// 	color: Colors.headerAndInputText,
	// },
});
