import { isFuture, isValid, parse, startOfToday } from 'date-fns';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	NativeSyntheticEvent,
	StyleSheet,
	TextInputFocusEventData,
	TextInputProps,
	View,
} from 'react-native';

import { Colors, Radius } from '@/shared/tokens';

import { AppTextInput } from '../Text';

export interface DateInputProps
	extends Omit<TextInputProps, 'onChange' | 'onChangeText' | 'value'> {
	/** Значение даты в формате DD.MM.YYYY (контролируемое) */
	value?: string;
	/** Коллбек изменения контролируемого значения в формате DD.MM.YYYY */
	onChangeText?: (value: string) => void;
	/** Вызывается при изменении валидности (true = валидно) */
	onValidityChange?: (isValid: boolean) => void;
	/** Показывать ли ошибку визуально */
	isInvalid?: boolean;
	/** Разрешать ли ввод будущих дат (для birthdate = false) */
	allowFuture?: boolean;
	/** Автоформатирование ввода пользователя */
	autoFormat?: boolean;
	/** Автовалидировать при каждом изменении */
	liveValidate?: boolean;
}

// Регулярка строгого формата
const DATE_PATTERN = /^\d{2}\.\d{2}\.\d{4}$/;

function parseDate(value: string) {
	if (!DATE_PATTERN.test(value)) return null;
	const date = parse(value, 'dd.MM.yyyy', startOfToday());
	if (!isValid(date)) return null;
	return date;
}

function formatInput(raw: string) {
	const cleaned = raw.replace(/\D/g, '').slice(0, 8);
	if (cleaned.length <= 2) return cleaned;
	if (cleaned.length <= 4)
		return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
	return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.${cleaned.slice(4)}`;
}

export const DateInput: React.FC<DateInputProps> = ({
	value,
	onChangeText,
	onValidityChange,
	isInvalid,
	allowFuture = true,
	autoFormat = true,
	liveValidate = true,
	style,
	onBlur,
	onFocus,
	placeholder = 'ДД.MM.ГГГГ',
	keyboardType = 'numeric',
	...rest
}) => {
	const [internal, setInternal] = useState(value ?? '');
	const [focused, setFocused] = useState(false);
	const externallyControlled = value !== undefined;
	const lastValidity = useRef<boolean | null>(null);

	// Синхронизируем внутреннее с внешним когда контролируемый проп меняется
	useEffect(() => {
		if (externallyControlled && value !== internal) {
			setInternal(value ?? '');
		}
	}, [value, externallyControlled, internal]);

	const validate = useCallback(
		(v: string) => {
			if (!DATE_PATTERN.test(v)) return false;
			const date = parseDate(v);
			if (!date) return false;
			if (!allowFuture) {
				if (isFuture(date)) return false;
			}
			return true;
		},
		[allowFuture],
	);

	const currentValidity = useMemo(
		() => validate(internal),
		[internal, validate],
	);

	useEffect(() => {
		if (
			liveValidate &&
			onValidityChange &&
			lastValidity.current !== currentValidity
		) {
			lastValidity.current = currentValidity;
			onValidityChange(currentValidity);
		}
	}, [currentValidity, liveValidate, onValidityChange]);

	const handleChange = (text: string) => {
		const next = autoFormat ? formatInput(text) : text;
		if (!externallyControlled) setInternal(next);
		onChangeText?.(next);
		if (!liveValidate && onValidityChange) {
			const valid = validate(next);
			if (lastValidity.current !== valid) {
				lastValidity.current = valid;
				onValidityChange(valid);
			}
		}
	};

	const mergedInvalid =
		isInvalid ?? (!currentValidity && internal.length === 10);

	const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
		setFocused(true);
		onFocus?.(e);
	};
	const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
		setFocused(false);
		onBlur?.(e);
		// Финальная валидация при блюре если не было live
		if (!liveValidate && onValidityChange) {
			const valid = validate(internal);
			if (lastValidity.current !== valid) {
				lastValidity.current = valid;
				onValidityChange(valid);
			}
		}
	};

	return (
		<View style={styles.container}>
			<AppTextInput
				value={internal}
				onChangeText={handleChange}
				placeholder={placeholder}
				placeholderTextColor={Colors.placeHolderInput}
				keyboardType={keyboardType}
				maxLength={10}
				style={[
					styles.input,
					focused && styles.inputFocused,
					mergedInvalid && styles.inputInvalid,
					style,
				]}
				onFocus={handleFocus}
				onBlur={handleBlur}
				{...rest}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { width: '100%' },
	input: {
		backgroundColor: Colors.white,
		borderColor: Colors.inputBorder,
		borderRadius: Radius.r16,
		borderWidth: 1,
		height: 54,
		paddingHorizontal: 16,
		textAlignVertical: 'center',
	},
	inputFocused: {
		borderBottomWidth: 2,
		borderColor: Colors.successGreen,
		borderWidth: 0,
	},
	inputInvalid: { borderColor: Colors.error },
});

export default DateInput;
