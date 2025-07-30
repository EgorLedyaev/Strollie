import { Input } from './Input';
import { TextInputProps } from 'react-native';

// Экспортируем тип InputProps для использования в других компонентах
export type InputProps = TextInputProps & { 
  isPassword?: boolean; 
  isInvalid?: boolean 
};

export { Input };
