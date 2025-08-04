import { Colors, Fonts } from '@/shared/tokens';
import React, { ComponentRef, useEffect, useRef, useState } from 'react';
import {
	Animated,
	Keyboard,
	LayoutChangeEvent,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

import { AppText, AppTextInput } from '../Text';
import { DropdownList, SelectField } from './components';
import { SelectOption, SelectProps } from './types';

/**
 * Компонент выпадающего списка (Select)
 *
 * Позволяет выбрать значение из списка опций с возможностью поиска.
 *
 * @example
 * ```tsx
 * <Select
 *   options={[
 *     { label: 'Опция 1', value: 'option1' },
 *     { label: 'Опция 2', value: 'option2' }
 *   ]}
 *   value={selectedValue}
 *   placeholder="Выберите опцию"
 *   onSelect={(option) => setSelectedValue(option.value)}
 *   label="Метка поля"
 * />
 * ```
 */
export const Select = ({
	options,
	value,
	placeholder = 'Выберите...',
	onSelect,
	label,
	isInvalid = false,
}: SelectProps) => {
	// Состояние компонента
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [containerLayout, setContainerLayout] = useState({
		width: 0,
		x: 0,
		y: 0,
	});

	// Анимированные значения для выпадающего списка
	const dropdownHeight = useRef(new Animated.Value(0)).current;
	const dropdownOpacity = useRef(new Animated.Value(0)).current;

	// Референс на поле ввода для фокуса
	const inputRef = useRef<ComponentRef<typeof AppTextInput>>(null);

	// Находим выбранную опцию
	const selectedOption = options.find(option => option.value === value);

	// Фильтруем опции по поисковому запросу
	const filteredOptions = options.filter(option =>
		option.label.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	/**
	 * Скрываем выпадающий список при скрытии клавиатуры
	 */
	useEffect(() => {
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			closeDropdown,
		);

		return () => {
			keyboardDidHideListener.remove();
		};
	}, []);

	/**
	 * Анимируем открытие/закрытие выпадающего списка
	 */
	useEffect(() => {
		if (isOpen) {
			// Высота списка в зависимости от количества элементов, но не более максимальной высоты
			const calculatedHeight = Math.min(filteredOptions.length * 54, 161);

			// Открываем выпадающий список
			Animated.parallel([
				Animated.timing(dropdownHeight, {
					toValue: calculatedHeight,
					duration: 300,
					useNativeDriver: false,
				}),
				Animated.timing(dropdownOpacity, {
					toValue: 1,
					duration: 200,
					useNativeDriver: false,
				}),
			]).start();
		} else {
			// Закрываем выпадающий список
			Animated.parallel([
				Animated.timing(dropdownHeight, {
					toValue: 0,
					duration: 200,
					useNativeDriver: false,
				}),
				Animated.timing(dropdownOpacity, {
					toValue: 0,
					duration: 150,
					useNativeDriver: false,
				}),
			]).start();
		}
	}, [isOpen, filteredOptions.length]);

	/**
	 * Обработчик выбора опции из выпадающего списка
	 */
	const handleSelect = (option: SelectOption) => {
		// Вызываем родительский обработчик с правильной опцией
		if (option && option.value) {
			onSelect(option);
		}
		closeDropdown();
	};

	/**
	 * Переключение состояния открытия/закрытия выпадающего списка
	 */
	const toggleDropdown = () => {
		if (!isOpen) {
			setSearchQuery('');
			inputRef.current?.focus();
		} else {
			Keyboard.dismiss();
		}
		setIsOpen(!isOpen);
	};

	/**
	 * Закрытие выпадающего списка
	 */
	const closeDropdown = () => {
		setIsOpen(false);
		setSearchQuery('');
		Keyboard.dismiss();
	};

	/**
	 * Обработчик события изменения размеров контейнера
	 */
	const handleContainerLayout = (event: LayoutChangeEvent) => {
		const { width, x, y } = event.nativeEvent.layout;
		setContainerLayout({ width, x, y });
	};

	return (
		<View style={styles.container} onLayout={handleContainerLayout}>
			{label && <AppText style={styles.label}>{label}</AppText>}

			{/* Поле ввода/выбора */}
			<SelectField
				isOpen={isOpen}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				inputRef={inputRef}
				selectedOption={selectedOption}
				placeholder={placeholder}
				isInvalid={!!isInvalid}
				onToggle={toggleDropdown}
			/>

			{/* Выпадающий список с TouchableWithoutFeedback для предотвращения закрытия списка при нажатии внутри */}
			<TouchableWithoutFeedback>
				<View>
					<DropdownList
						filteredOptions={filteredOptions}
						value={value}
						dropdownHeight={dropdownHeight}
						dropdownOpacity={dropdownOpacity}
						containerWidth={containerLayout.width}
						onSelect={handleSelect}
					/>
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
};

/**
 * Стили основного компонента Select
 */
const styles = StyleSheet.create({
	container: {
		width: '100%',
		zIndex: 1, // Чтобы дропдаун был поверх других элементов
	},
	label: {
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
		color: Colors.headerAndInputText,
		marginLeft: 16,
		marginBottom: 12,
	},
});
