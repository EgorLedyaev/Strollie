import { Colors, Fonts, Radius } from '@/src/shared/tokens';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import ArrowDownIcon from '@/assets/icons/arrow-down';
import ArrowUpIcon from '@/assets/icons/arrow-up';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onSelect: (option: SelectOption) => void;
  label?: string;
  isInvalid?: boolean;
}

export const Select = ({
  options,
  value,
  placeholder = 'Выберите...',
  onSelect,
  label,
  isInvalid = false,
}: SelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(option => option.value === value);
  
  const handleSelect = (option: SelectOption) => {
    onSelect(option);
    setModalVisible(false);
    setIsOpen(false);
  };
  
  const handleToggleModal = () => {
    setModalVisible(!modalVisible);
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        style={[
          styles.selectContainer, 
          isInvalid && styles.invalidContainer
        ]} 
        onPress={handleToggleModal}
        activeOpacity={0.7}
      >
        <Text 
          style={[
            styles.selectText, 
            !selectedOption && styles.placeholderText
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        {isOpen ? (
          <ArrowUpIcon stroke={Colors.inputText} />
        ) : (
          <ArrowDownIcon stroke={Colors.inputText} />
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={handleToggleModal}
        >
          <View style={styles.modalContainer}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === value && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      item.value === value && styles.selectedOptionText
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.optionsList}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: Fonts.f16,
    color: Colors.inputText,
    marginLeft: 16,
    marginBottom: 12,
  },
  selectContainer: {
    height: 58,
    width: '100%',
    borderWidth: 1,
    borderRadius: Radius.r15,
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
  selectText: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.f16,
    color: Colors.inputText,
  },
  placeholderText: {
    color: Colors.placeholderGray,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 30,
    maxHeight: '70%',
  },
  optionsList: {
    width: '100%',
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inputBorder,
  },
  selectedOption: {
    backgroundColor: Colors.lightBackground,
  },
  optionText: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.f16,
    color: Colors.inputText,
  },
  selectedOptionText: {
    fontFamily: Fonts.medium,
    color: Colors.linkGreen,
  },
});
