import { Colors, Fonts } from '@/src/shared/tokens';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
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
  onSelect 
}) => {
  // Создаем обработчик нажатия с отладкой
  const handlePress = () => {
    console.log('SelectOption pressed:', item);
    // Явно передаем выбранную опцию в обработчик с небольшой задержкой для улучшения UX
    setTimeout(() => {
      onSelect(item);
    }, 0);
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.optionItem,
        isSelected && styles.selectedOption
      ]}
      onPress={handlePress}
      activeOpacity={0.5}
      delayPressIn={0}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
      <Text 
        style={[
          styles.optionText,
          isSelected && styles.selectedOptionText
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    height: 54,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.inputOptionBorder,
  },
  selectedOption: {
    backgroundColor: Colors.optionHighlight,
  },
  optionText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.inputText,
  },
  selectedOptionText: {
    fontFamily: Fonts.medium,
  },
});
