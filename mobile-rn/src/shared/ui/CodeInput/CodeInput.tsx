import { Colors, Fonts } from '@/shared/tokens';
import React, { ComponentRef, useEffect, useRef, useState } from 'react';
import {
	Animated,
	NativeSyntheticEvent,
	StyleProp,
	StyleSheet,
	TextInputKeyPressEventData,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';

import { AppTextInput } from '../Text';

/**
 * Компонент для ввода кодов подтверждения.
 * Используется на экране верификации и других экранах, где требуется ввод кода.
 *
 * Состояния компонента:
 * 1. Обычное состояние: Поля с серой рамкой
 * 2. Активное состояние: Поле с зеленой рамкой и мигающим курсором
 * 3. Заполненное состояние: Поле с зеленой рамкой и отображением цифры
 * 4. Состояние ошибки: Поля с красной рамкой
 *
 * @example
 * ```tsx
 * const [code, setCode] = useState('');
 *
 * return (
 *   <CodeInput
 *     value={code}
 *     onChangeText={setCode}
 *     length={4}
 *     autoFocus={true}
 *     isError={false}
 *   />
 * );
 * ```
 */
export interface CodeInputProps {
	/** Текущее значение кода */
	value: string;
	/** Обработчик изменения значения */
	onChangeText: (text: string) => void;
	/** Длина кода (количество полей) */
	length?: number;
	/** Автоматически фокусироваться при загрузке */
	autoFocus?: boolean;
	/** Показывать состояние ошибки */
	isError?: boolean;
	/** Дополнительные стили контейнера */
	style?: StyleProp<ViewStyle>;
}

export const CodeInput: React.FC<CodeInputProps> = ({
	value,
	onChangeText,
	length = 4,
	autoFocus = true,
	isError = false,
	style,
}) => {
	const inputsRef = useRef<Array<ComponentRef<typeof AppTextInput> | null>>(
		[],
	);
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
	const cursorOpacity = useRef(new Animated.Value(1)).current;

	/**
	 * Автоматический фокус на первом поле ввода при монтировании компонента
	 */
	useEffect(() => {
		if (autoFocus && inputsRef.current[0]) {
			setTimeout(() => inputsRef.current[0]?.focus(), 100);
		}
	}, [autoFocus]);

	/**
	 * Анимация мигания курсора для активного поля
	 */
	useEffect(() => {
		if (focusedIndex !== null) {
			const animateCursor = () => {
				Animated.sequence([
					Animated.timing(cursorOpacity, {
						toValue: 0,
						duration: 1000,
						useNativeDriver: true,
					}),
					Animated.timing(cursorOpacity, {
						toValue: 1,
						duration: 1000,
						useNativeDriver: true,
					}),
				]).start(animateCursor);
			};

			animateCursor();

			return () => {
				// Сбрасываем анимацию при размонтировании
				cursorOpacity.setValue(1);
				cursorOpacity.stopAnimation();
			};
		}
	}, [focusedIndex, cursorOpacity]);

	/**
	 * Переключает фокус на определенное поле ввода
	 */
	const focusInput = (index: number) => {
		if (index >= 0 && index < length && inputsRef.current[index]) {
			inputsRef.current[index]?.focus();
		}
	};

	/**
	 * Обработчик нажатия на поле ввода кода
	 */
	const handlePress = (index: number) => {
		focusInput(index);
	};

	/**
	 * Обработчик изменения текста в поле ввода
	 */
	const handleChangeText = (text: string, index: number) => {
		// Принимаем только цифры
		if (!/^\d*$/.test(text)) return;

		// Создаем новое значение, заменяя символ в указанной позиции
		const newValue = value.split('');

		if (text.length > 0) {
			newValue[index] = text[text.length - 1];

			// Если введен новый символ, переходим к следующему полю
			if (index < length - 1) {
				focusInput(index + 1);
			}
		} else {
			// Если удалили символ, оставляем пустое место
			newValue[index] = '';
		}

		onChangeText(newValue.join(''));
	};

	/**
	 * Обработчик нажатия клавиши Backspace
	 */
	const handleKeyPress = (
		e: NativeSyntheticEvent<TextInputKeyPressEventData>,
		index: number,
	) => {
		if (e.nativeEvent.key === 'Backspace') {
			// Если текущее поле пустое, а нажат Backspace, переходим к предыдущему полю
			if (index > 0 && !value[index]) {
				focusInput(index - 1);
			}
		}
	};

	/**
	 * Рендерит поля для ввода кода
	 */
	const renderCodeBoxes = () => {
		const boxes = [];

		for (let i = 0; i < length; i++) {
			const isFilled = !!value[i];
			const isFocused = focusedIndex === i;

			boxes.push(
				<TouchableOpacity
					key={i}
					activeOpacity={0.7}
					onPress={() => handlePress(i)}
				>
					<View
						style={[
							styles.codeBox,
							isFilled && styles.codeBoxFilled,
							isFocused && styles.codeBoxFocused,
							isError && styles.codeBoxError,
						]}
					>
						<AppTextInput
							ref={ref => {
								inputsRef.current[i] = ref;
							}}
							style={styles.codeText}
							value={value[i] || ''}
							onChangeText={text => handleChangeText(text, i)}
							maxLength={1}
							keyboardType='number-pad'
							onFocus={() => setFocusedIndex(i)}
							onBlur={() => setFocusedIndex(null)}
							onKeyPress={e => handleKeyPress(e, i)}
							caretHidden={true} // Скрываем нативный курсор, так как у нас свой
							selectTextOnFocus={true}
							testID={`code-input-${i}`}
						/>

						{isFocused && !isFilled && (
							<Animated.View
								style={[
									styles.cursor,
									{ opacity: cursorOpacity },
								]}
							/>
						)}
					</View>
				</TouchableOpacity>,
			);
		}

		return boxes;
	};

	return (
		<View style={[styles.container, style]}>
			<View style={styles.codeContainer}>{renderCodeBoxes()}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	/**
	 * Основной контейнер компонента
	 */
	container: {
		width: '100%',
	},
	/**
	 * Контейнер для полей ввода кода
	 */
	codeContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		width: '100%',
	},
	/**
	 * Стиль отдельного поля для ввода цифры
	 */
	codeBox: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderColor: Colors.inputBorder,
		borderRadius: 16,
		borderWidth: 1,
		height: 54,
		justifyContent: 'center',
		marginHorizontal: 8,
		position: 'relative',
		width: 54,
	},
	/**
	 * Стиль поля с заполненной цифрой
	 */
	codeBoxFilled: {
		borderColor: Colors.successGreen,
	},
	/**
	 * Стиль активного поля ввода
	 */
	codeBoxFocused: {
		borderColor: Colors.successGreen,
	},
	/**
	 * Стиль поля при ошибке
	 */
	codeBoxError: {
		borderColor: Colors.error,
	},
	/**
	 * Стиль текста цифры в поле
	 */
	codeText: {
		fontFamily: Fonts.medium,
		fontSize: Fonts.f24,
		height: '100%',
		paddingVertical: 0,
		textAlign: 'center',
		width: '100%',
	},
	/**
	 * Стиль мигающего курсора
	 */
	cursor: {
		alignSelf: 'center',
		backgroundColor: Colors.successGreen,
		height: 27,
		position: 'absolute',
		width: 2,
	},
});
