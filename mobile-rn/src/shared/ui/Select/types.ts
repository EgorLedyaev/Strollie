/**
 * Тип представляющий элемент выпадающего списка
 */
export interface SelectOption {
	/** Отображаемая метка */
	label: string;
	/** Значение опции */
	value: string;
}

/**
 * Свойства компонента Select
 */
export interface SelectProps {
	/** Список доступных опций */
	options: SelectOption[];
	/** Выбранное значение */
	value?: string;
	/** Текст-подсказка при отсутствии выбранного значения */
	placeholder?: string;
	/** Обработчик выбора опции */
	onSelect: (option: SelectOption) => void;
	/** Метка поля (подпись над селектом) */
	label?: string;
	/** Флаг состояния ошибки */
	isInvalid?: boolean;
	/** Текст ошибки */
	error?: string;
}
