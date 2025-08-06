/**
 * Цветовая палитра приложения
 */
export const Colors = {
	// Основные цвета
	black: '#000000',
	white: '#FFFFFF',

	// Серые оттенки
	gray: '#E5E5E5',
	grayAvatar: '#B1B1B1', // Цвет фона аватара
	darkGray: '#606060',
	lightGray: '#919191',
	textGray: '#6D6D6D',
	grayMedium: '#C7C7C7', // Цвет текста для отключенных кнопок
	disabledGray: '#EAEAEA', // Цвет фона для отключенных кнопок
	lightBackground: '#F6F6F6',
	grayIcon: '#626262',
	overlayBackground: '#F1F1F1', // Цвет фона для оверлея
	grayBackground: '#F4F4F4', // Цвет фона для серых блоков
	grayText: '#626262', // Цвет текста в серых блоках
	backgroundBetweenNavbarAndPanel: '#F6F6F6', // Цвет фона между навбаром и панелью

	// Цвета для форм и инпутов
	inputBorder: '#E7E7E7',
	headerAndInputText: '#484848', // Цвет текста в инпутах и в заголовках
	placeholderGray: '#B2B2B2',
	placeHolderInput: '#B3B3B3', // Цвет плейсхолдера в инпутах
	searchDivider: '#D7D7D7', // Цвет разделителя в поле поиска
	inputOptionBorder: '#F4F4F4', // Цвет бордера опций в выпадающем списке

	// Цвета для скроллбара
	scrollbarTrack: '#DDDDDD', // Цвет фона скроллбара
	scrollbarThumb: '#BDBDBD', // Цвет ползунка скроллбара

	// Цвета выделения
	optionHighlight: 'rgba(31, 31, 31, 0.1)', // Цвет выделения опции в выпадающем списке
	backgroundMapStatus: 'rgba(255,255,255,0.8)',
	shadowButton: 'rgba(169, 169, 169, 0.25)',

	// Зеленые оттенки
	successGreen: '#45CD86',
	greenLink: '#1EB18C',
	greenPrimary: '#1FD975',
	greenSecondary: '#1CC4C4',
	greenHover: '#027962',

	// Другие цвета
	red: '#CC384E',
	error: '#CC384E', // Alias for red for error messages

	transparent: 'transparent',
};

export const Gaps = {
	g8: 8,
	g12: 12,
	g15: 15,
	g16: 16,
	g20: 20,
	g50: 50,
};

export const Radius = {
	r10: 10,
	r15: 15,
	r16: 16,
	r20: 20,
};

export const Fonts = {
	f12: 12,
	f14: 14,
	f16: 16,
	f18: 18,
	f20: 20,
	f24: 24,
	f32: 32,
	regular: 'SuisseIntl-Regular', // weight 400
	medium: 'SuisseIntl-Medium', // weight 500
	semibold: 'SuisseIntl-SemiBold', // weight 600
	bold: 'SuisseIntl-Bold', // weight 700
};

export const Shadows = {
	boxShadow:
		'-2px -4px 6px rgba(169,169,169,0.25), 2px  4px 6px rgba(169,169,169,0.25)',
	boxShadow_elev2: '0px 1px 3px rgba(0,0,0,0.2)',
};
