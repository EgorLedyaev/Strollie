import { TextInputProps } from 'react-native';

import { Input } from './Input';

// Экспортируем тип InputProps для использования в других компонентах
export type InputProps = TextInputProps & {
	isPassword?: boolean;
	isInvalid?: boolean;
};

export { Input };
