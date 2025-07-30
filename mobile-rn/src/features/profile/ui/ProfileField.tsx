import React from 'react';
import { View, Text, StyleSheet, TextInput, TextInputProps } from 'react-native';
import { Colors, Fonts } from '@/src/shared/tokens';

interface ProfileFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
  ...rest
}) => {
  return (
    <View style={[styles.container, multiline && numberOfLines > 1 && styles.multilineContainer]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && numberOfLines > 1 && styles.multilineInput
        ]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.inputBorder,
    paddingVertical: 10,
  },
  multilineContainer: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.darkGray,
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.black,
    paddingVertical: 5,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});
