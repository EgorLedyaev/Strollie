import ArrowDownIcon from '@/assets/icons/arrow/arrow-down';
import ArrowUpIcon from '@/assets/icons/arrow/arrow-up';
import React, { ComponentRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Colors, Fonts, Radius } from '@/shared/tokens';

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
	activeContainer: {
		borderBottomColor: Colors.successGreen,
		borderBottomLeftRadius: Radius.r0,
		borderBottomRightRadius: Radius.r0,
		borderBottomWidth: 2,
		borderColor: Colors.inputBorder,
	},
	invalidContainer: {
		borderColor: Colors.error,
	},
	placeholderText: {
		color: Colors.placeHolderInput,
	},
	searchInput: {
		color: Colors.headerAndInputText,
		flex: 1,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
		height: '100%',
		includeFontPadding: false,
		padding: 0,
		textAlignVertical: 'center',
	},
	selectContainer: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r16,
		borderWidth: 1,
		flexDirection: 'row',
		height: 54,
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		width: '100%',
	},
	selectText: {
		color: Colors.headerAndInputText,
		flex: 1,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
		includeFontPadding: false,
		textAlignVertical: 'center',
	},
});
