import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Colors, Fonts } from '@/shared/tokens';

import { AppText } from '../../Text';
import { SelectOption as SelectOptionType } from '../types';

interface SelectOptionProps {
	item: SelectOptionType;
	isSelected: boolean;
	onSelect: (option: SelectOptionType) => void;
}

/**
 * Компонент для отображения отдельной опции выпадающего списка
 *
 * @param item - Данные опции (значение и метка)
 * @param isSelected - Флаг выбрана ли текущая опция
 * @param onSelect - Обработчик выбора опции
 */
export const SelectOption: React.FC<SelectOptionProps> = ({
	item,
	isSelected,
	onSelect,
}) => {
	return (
		<TouchableOpacity
			style={[styles.optionItem, isSelected && styles.selectedOption]}
			onPress={() => onSelect(item)}
			activeOpacity={0.5}
		>
			<AppText
				style={[
					styles.optionText,
					isSelected && styles.selectedOptionText,
				]}
			>
				{item.label}
			</AppText>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	optionItem: {
		borderBottomColor: Colors.inputOptionBorder,
		borderBottomWidth: 1,
		height: 54,
		justifyContent: 'center',
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	optionText: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.regular,
		fontSize: 16,
	},
	selectedOption: { backgroundColor: Colors.optionHighlight },
	selectedOptionText: { fontFamily: Fonts.medium },
});
