import type { PressableProps } from 'react-native';

import { AppButton } from './AppButton';
import { IconButton } from './IconButton';

// Экспортируем типы для использования в других компонентах
export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export interface AppButtonProps extends PressableProps {
	children: React.ReactNode;
	variant?: ButtonVariant;
	disabled?: boolean;
}

export { AppButton, IconButton };
