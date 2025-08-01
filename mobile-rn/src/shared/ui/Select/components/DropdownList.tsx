import React from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';

import { Colors, Fonts } from '@/src/shared/tokens';
import { AppText } from '@/src/shared/ui';

import { SelectOption as SelectOptionType } from '../types';
import { SelectOption } from './SelectOption';

interface DropdownListProps {
	filteredOptions: SelectOptionType[];
	value?: string;
	dropdownHeight: Animated.Value;
	dropdownOpacity: Animated.Value;
	containerWidth: number;
	onSelect: (option: SelectOptionType) => void;
}

/**
 * Компонент отображающий выпадающий список опций
 */
export const DropdownList: React.FC<DropdownListProps> = ({
	filteredOptions,
	value,
	dropdownHeight,
	dropdownOpacity,
	containerWidth,
	onSelect,
}) => {
	return (
		<Animated.View
			style={[
				styles.dropdownContainer,
				{
					width: containerWidth,
					height: dropdownHeight,
					opacity: dropdownOpacity,
				},
			]}
		>
			{filteredOptions.length > 0 ? (
				<ScrollView
					nestedScrollEnabled
					keyboardShouldPersistTaps='handled'
					showsVerticalScrollIndicator={true}
					style={styles.optionsList}
				>
					{filteredOptions.map(item => (
						<SelectOption
							key={item.value}
							item={item}
							isSelected={item.value === value}
							onSelect={option => {
								onSelect(option);
							}}
						/>
					))}
				</ScrollView>
			) : (
				<View style={styles.noResultsContainer}>
					<AppText style={styles.noResultsText}>
						Ничего не найдено
					</AppText>
				</View>
			)}

			{/* Полоса скроллинга справа (скрыта, т.к. FlatList имеет свой индикатор) */}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	dropdownContainer: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		backgroundColor: Colors.white,
		borderWidth: 1,
		borderTopWidth: 0,
		borderColor: Colors.inputBorder,
		borderBottomLeftRadius: 16,
		borderBottomRightRadius: 16,
		overflow: 'hidden',
		zIndex: 999,
		elevation: 5, // Для Android
		shadowColor: Colors.black, // Для iOS
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	optionsList: {
		width: '100%',
		height: 161, // Фиксированная высота из дизайна в Figma
		flex: 1,
	},
	scrollIndicator: {
		position: 'absolute',
		right: 2,
		top: 0,
		bottom: 0,
		width: 6,
		backgroundColor: Colors.scrollbarTrack,
		borderRadius: 100,
		justifyContent: 'center',
	},
	scrollThumb: {
		width: 4,
		height: 32,
		backgroundColor: Colors.scrollbarThumb,
		borderRadius: 100,
		alignSelf: 'center',
	},
	noResultsContainer: {
		height: 54,
		justifyContent: 'center',
		alignItems: 'center',
	},
	noResultsText: {
		fontFamily: Fonts.regular,
		fontSize: 16,
		color: Colors.placeHolderInput,
	},
});
