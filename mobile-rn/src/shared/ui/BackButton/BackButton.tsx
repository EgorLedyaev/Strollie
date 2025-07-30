import { Colors, Fonts } from '@/src/shared/tokens';
import ArrowLeftIcon from '@/assets/icons/arrow-left';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { router } from 'expo-router';

interface BackButtonProps extends TouchableOpacityProps {
  text?: string;
  onPress?: () => void;
}

export const BackButton = ({ 
  text = 'Вернуться', 
  onPress = () => router.back(),
  style,
  ...props 
}: BackButtonProps) => {
  return (
    <TouchableOpacity 
      style={[styles.backButton, style]} 
      onPress={onPress} 
      {...props}
    >
      <ArrowLeftIcon style={styles.backButtonIcon} stroke={Colors.linkGreen} />
      <Text style={styles.backLinkText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 101,
    height: 20,
  },
  backButtonIcon: {
    marginRight: 5,
    width: 19,
  },
  backLinkText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.linkGreen,
  },
});
