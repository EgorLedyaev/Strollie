import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Colors, Fonts } from '@/shared/tokens';

import { AppText } from '../../Text';
import { SelectOption as SelectOptionType } from '../types';
import { SelectOption } from './SelectOption';

interface DropdownListProps {
	filteredOptions: SelectOptionType[];
	value?: string;
	onSelect: (option: SelectOptionType) => void;
}

export const DropdownList: React.FC<DropdownListProps> = ({
	filteredOptions,
	value,
	onSelect,
}) => {
	if (filteredOptions.length === 0) {
		return (
			<View style={styles.noResultsContainer}>
				<AppText style={styles.noResultsText}>
					Ничего не найдено
				</AppText>
			</View>
		);
	}

	return (
		<ScrollView
			style={styles.optionsList}
			keyboardShouldPersistTaps='handled'
			showsVerticalScrollIndicator={false}
		>
			{filteredOptions.map(item => (
				<SelectOption
					key={item.value}
					item={item}
					isSelected={item.value === value}
					onSelect={onSelect}
				/>
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	noResultsContainer: {
		alignItems: 'center',
		height: 54,
		justifyContent: 'center',
	},
	noResultsText: {
		color: Colors.placeHolderInput,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
	},
	optionsList: {
		width: '100%',
	},
});
