import ArrowDownIcon from '@/assets/icons/arrow-down';
import ArrowUpIcon from '@/assets/icons/arrow-up';
import { Colors, Fonts } from '@/src/shared/tokens';
import React from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

import { SelectOption } from '../types';

interface SelectFieldProps {
	isOpen: boolean;
	searchQuery: string;
	onSearchChange: (text: string) => void;
	inputRef: React.RefObject<TextInput | null>;
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
				<TextInput
					ref={inputRef}
					style={styles.searchInput}
					value={searchQuery}
					onChangeText={onSearchChange}
					placeholder={placeholder}
					placeholderTextColor={Colors.placeHolderInput}
					autoFocus={true}
				/>
			) : (
				<Text
					style={[
						styles.selectText,
						!selectedOption && styles.placeholderText,
					]}
				>
					{selectedOption ? selectedOption.label : placeholder}
				</Text>
			)}

			{isOpen ? (
				<ArrowUpIcon stroke={Colors.inputText} />
			) : (
				<ArrowDownIcon stroke={Colors.inputText} />
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
		color: Colors.inputText,
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
		color: Colors.inputText,
		flex: 1,
		height: '100%',
		padding: 0,
		textAlignVertical: 'center', // Добавляем вертикальное выравнивание
		includeFontPadding: false, // Убираем лишние отступы шрифта
	},
});
