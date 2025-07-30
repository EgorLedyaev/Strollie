import { Colors, Fonts } from '@/src/shared/tokens';
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Animated, FlatList } from 'react-native';
import { SelectOption } from './SelectOption';
import { SelectOption as SelectOptionType } from '../types';

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
  onSelect
}) => {
  // Отрисовка элемента списка
  const renderItem = ({ item }: { item: SelectOptionType }) => (
    <SelectOption
      key={item.value}
      item={item}
      isSelected={item.value === value}
      onSelect={(option) => {
        console.log('Option selected in DropdownList:', option);
        onSelect(option);
      }}
    />
  );

  return (
    <Animated.View 
      style={[
        styles.dropdownContainer,
        {
          width: containerWidth,
          height: dropdownHeight,
          opacity: dropdownOpacity,
        }
      ]}
    >
      {filteredOptions.length > 0 ? (
        <FlatList
          data={filteredOptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.value}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          maxToRenderPerBatch={10}
          initialNumToRender={8}
          showsVerticalScrollIndicator={true}
          style={styles.optionsList}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>Ничего не найдено</Text>
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
