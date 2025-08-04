import ArrowDownIcon from '@/assets/icons/arrow-down';
import ArrowUpIcon from '@/assets/icons/arrow-up';
import React, { ComponentRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Colors, Fonts } from '@/shared/tokens';

import { AppText, AppTextInput } from '../../Text';
import { SelectOption } from '../types';

interface SelectFieldProps {
	isOpen: boolean;
	searchQuery: string;
	onSearchChange: (text: string) => void;
	inputRef: React.RefObject<ComponentRef<typeof AppTextInput> | null>;
	selectedOption?: SelectOption;
	placeholder: string;
	isInvalid: boolean;
	onToggle: () => void;
}

/**
 * Компонент поля ввода/выбора для Select
 */
export const SelectField: React.FC<SelectFieldProps> = ({
	isOpen,
	searchQuery,
	onSearchChange,
	inputRef,
	selectedOption,
	placeholder,
	isInvalid,
	onToggle,
}) => {
	return (
		<TouchableOpacity
			style={[
				styles.selectContainer,
				isInvalid && styles.invalidContainer,
				isOpen && styles.activeContainer,
			]}
			onPress={onToggle}
			activeOpacity={0.7}
		>
			{isOpen ? (
				<AppTextInput
					ref={inputRef}
					style={styles.searchInput}
					value={searchQuery}
					onChangeText={onSearchChange}
					placeholder={placeholder}
					placeholderTextColor={Colors.placeHolderInput}
					autoFocus={true}
				/>
			) : (
				<AppText
					style={[
						styles.selectText,
						!selectedOption && styles.placeholderText,
					]}
				>
					{selectedOption ? selectedOption.label : placeholder}
				</AppText>
			)}

			{isOpen ? (
				<ArrowUpIcon stroke={Colors.headerAndInputText} />
			) : (
				<ArrowDownIcon stroke={Colors.headerAndInputText} />
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	selectContainer: {
		height: 54,
		width: '100%',
		borderWidth: 1,
		borderRadius: 16,
		borderColor: Colors.inputBorder,
		paddingHorizontal: 16,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: Colors.white,
	},
	invalidContainer: {
		borderColor: Colors.error,
	},
	activeContainer: {
		borderColor: Colors.inputBorder,
		borderBottomColor: Colors.successGreen,
		borderBottomWidth: 2,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	selectText: {
		fontFamily: Fonts.regular,
		fontSize: 16,
		color: Colors.headerAndInputText,
		flex: 1,
		textAlignVertical: 'center', // Добавляем вертикальное выравнивание
		includeFontPadding: false, // Убираем лишние отступы шрифта
	},
	placeholderText: {
		color: Colors.placeHolderInput,
	},
	searchInput: {
		fontFamily: Fonts.regular,
		fontSize: 16,
		color: Colors.headerAndInputText,
		flex: 1,
		height: '100%',
		padding: 0,
		textAlignVertical: 'center', // Добавляем вертикальное выравнивание
		includeFontPadding: false, // Убираем лишние отступы шрифта
	},
});
