// Anchored bidirectional Select (auto up/down) with keyboard & safe-area awareness
import ArrowDownIcon from '@/assets/icons/arrow/arrow-down';
import ArrowUpIcon from '@/assets/icons/arrow/arrow-up';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View, Keyboard } from 'react-native';

import { Colors, Fonts } from '@/shared/tokens';

import { AppText, AppTextInput } from '../Text';
import { DropdownList } from './components';
import type { SelectOption, SelectProps } from './types';

// Anchored overlay Select
const MAX_DROPDOWN_HEIGHT = 300;

export const Select: React.FC<SelectProps> = ({
	options,
	value,
	placeholder = 'Введите город',
	onSelect,
	label,
	isInvalid = false,
}) => {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	const inputRef = useRef<{ focus?: () => void } | null>(null);
	const anchorRef = useRef<View | null>(null);
	const [anchor, setAnchor] = useState<{
		x: number;
		y: number;
		w: number;
		h: number;
	} | null>(null);
	// Параметры размещения
	const [placement, setPlacement] = useState<{
		direction: 'up' | 'down';
		top: number; // абсолютный top
		maxHeight: number; // суммарная высота карточки (search + list)
	} | null>(null);
	const [keyboardY, setKeyboardY] = useState<number>(Dimensions.get('window').height); // граница низа

	const selected = useMemo(
		() => options.find(o => o.value === value) || null,
		[options, value],
	);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return options;
		return options.filter(o => o.label.toLowerCase().includes(q));
	}, [options, query]);

	const measure = (cb?: () => void) => {
		requestAnimationFrame(() => {
			anchorRef.current?.measureInWindow?.((x, y, w, h) => {
				setAnchor({ x, y, w, h });
				if (cb) cb();
			});
		});
	};

	const openDropdown = () => {
		measure(() => {
			setOpen(true);
		});
	};
	const closeDropdown = () => {
		setOpen(false);
		setQuery('');
	};
	const toggle = () => (open ? closeDropdown() : openDropdown());

	useEffect(() => {
		if (open) {
			setTimeout(() => inputRef.current?.focus?.(), 40);
		}
	}, [open]);

	// Keyboard listeners
	useEffect(() => {
		const show = Keyboard.addListener('keyboardDidShow', e => {
			const y = e.endCoordinates?.screenY ?? Dimensions.get('window').height;
			setKeyboardY(y);
			if (open) computePlacement(anchor, y);
		});
		const hide = Keyboard.addListener('keyboardDidHide', () => {
			const h = Dimensions.get('window').height;
			setKeyboardY(h);
			if (open) computePlacement(anchor, h);
		});
		return () => { show.remove(); hide.remove(); };
	}, [open, anchor]);

	// Orientation / window size changes
	useEffect(() => {
		if (!open) return;
		const sub = Dimensions.addEventListener('change', () => {
			const h = Dimensions.get('window').height;
			setKeyboardY(h);
			measure(() => computePlacement(anchor, h));
		});
		return () => { sub.remove(); };
	}, [open, anchor]);

	const computePlacement = (anch: typeof anchor, kbY: number) => {
		if (!anch) return;
		const searchBar = 54;
		const maxList = MAX_DROPDOWN_HEIGHT;
		const desired = searchBar + maxList;
		const bottomBoundary = kbY; // верх клавиатуры или низ экрана
		const spaceBelow = bottomBoundary - (anch.y + anch.h);
		const spaceAbove = anch.y;
		let direction: 'up' | 'down' = 'down';
		if (spaceBelow < searchBar + 100 && spaceAbove > spaceBelow) {
			direction = 'up';
		}
		if (direction === 'down') {
			const total = Math.min(desired, spaceBelow - 8);
			const maxHeight = Math.max(total, searchBar + 40);
			setPlacement({ direction, top: anch.y + anch.h, maxHeight });
		} else {
			const total = Math.min(desired, spaceAbove - 8);
			const maxHeight = Math.max(total, searchBar + 40);
			const top = Math.max(0, anch.y - maxHeight);
			setPlacement({ direction, top, maxHeight });
		}
	};

	// Первичное вычисление после открытия или смены anchor
	useEffect(() => {
		if (open && anchor) computePlacement(anchor, keyboardY);
	}, [open, anchor, keyboardY]);

	const handleSelect = (opt: SelectOption) => {
		onSelect(opt);
		setOpen(false);
		setQuery('');
	};

	// dropdownTop теперь внутри placement

	return (
		<View style={styles.wrapper}>
			{label && <AppText style={styles.label}>{label}</AppText>}
			<View
				ref={r => {
					anchorRef.current = r;
				}}
				// не переразмеряем на каждый layout чтобы исключить прыжки
				style={[
					styles.container,
					open && styles.containerOpen,
					isInvalid && styles.invalid,
				]}
			>
				<Pressable
					style={styles.fieldRow}
					onPress={toggle}
					accessibilityRole='button'
				>
					<AppText
						style={[
							styles.valueText,
							!selected && styles.placeholder,
						]}
						numberOfLines={1}
					>
						{selected ? selected.label : placeholder}
					</AppText>
					{open ? (
						<ArrowUpIcon stroke={Colors.placeHolderInput} />
					) : (
						<ArrowDownIcon stroke={Colors.placeHolderInput} />
					)}
				</Pressable>
			</View>

			{open && placement && (
				<Modal
					transparent
					statusBarTranslucent
					visible={open}
					onRequestClose={closeDropdown}
				>
					<Pressable
						style={styles.modalBackdrop}
						onPress={closeDropdown}
						accessibilityRole='button'
					/>
					{anchor && (
						<View
							style={[
								styles.dropdownCard,
								{
									top: placement.top,
									left: anchor.x,
									width: anchor.w,
									maxHeight: placement.maxHeight,
								},
							]}
						>
							<View style={styles.searchRow}>
								<AppTextInput
									ref={node => {
										if (node)
											inputRef.current =
												node as unknown as {
													focus?: () => void;
												};
									}}
									value={query}
									onChangeText={setQuery}
									placeholder={placeholder}
									placeholderTextColor={
										Colors.placeHolderInput
									}
									style={styles.searchInput}
									autoCapitalize='none'
									autoCorrect={false}
									returnKeyType='done'
								/>
							</View>
							<View style={[styles.listHolder, { maxHeight: placement.maxHeight - 54 }]}>
								<DropdownList
									filteredOptions={filtered}
									value={value}
									onSelect={handleSelect}
								/>
							</View>
						</View>
					)}
				</Modal>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {},
	label: {
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
		color: Colors.headerAndInputText,
		marginLeft: 16,
		marginBottom: 12,
	},
	container: {
		borderWidth: 1,
		borderColor: Colors.inputBorder,
		borderRadius: 16,
		backgroundColor: Colors.white,
		overflow: 'hidden',
		zIndex: 2,
	},
	containerOpen: {
		borderColor: Colors.inputBorder,
	},
	invalid: { borderColor: Colors.error },
	fieldRow: {
		height: 54,
		paddingHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	valueText: {
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
		color: Colors.headerAndInputText,
		flex: 1,
		marginRight: 8,
	},
	placeholder: { color: Colors.placeHolderInput },
	modalBackdrop: { flex: 1, backgroundColor: Colors.transparent },
	dropdownCard: {
		position: 'absolute',
		borderWidth: 1,
		borderColor: Colors.inputBorder,
		borderRadius: 16,
		backgroundColor: Colors.white,
		overflow: 'hidden',
		maxHeight: MAX_DROPDOWN_HEIGHT + 54,
	},
	searchRow: {
		height: 54,
		justifyContent: 'center',
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: Colors.inputOptionBorder,
	},
	searchInput: {
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
		color: Colors.headerAndInputText,
		padding: 0,
	},
	listHolder: { maxHeight: MAX_DROPDOWN_HEIGHT },
});
