import { AppButton } from './AppButton';
import type { PressableProps } from 'react-native';

// Экспортируем типы для использования в других компонентах
export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export interface AppButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
}

export { AppButton };
