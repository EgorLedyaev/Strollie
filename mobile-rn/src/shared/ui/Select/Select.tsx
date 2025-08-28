// Anchored bidirectional Select (auto up/down) with keyboard & safe-area awareness
import ArrowDownIcon from '@/assets/icons/arrow/arrow-down';
import ArrowUpIcon from '@/assets/icons/arrow/arrow-up';
import React, { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Fonts } from '@/shared/tokens';
import { AppText, AppTextInput } from '../Text';
import { DropdownList } from './components';
import type { SelectOption, SelectProps } from './types';

// Inline expanding Select (без Modal) – контейнер просто увеличивается
const MAX_INLINE_HEIGHT = 300; // ограничение для списка

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

	const selected = useMemo(
		() => options.find(o => o.value === value) || null,
		[options, value],
	);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return options;
		return options.filter(o => o.label.toLowerCase().includes(q));
	}, [options, query]);

	const toggle = () => {
		if (open) {
			setOpen(false);
			setQuery('');
		} else {
			setOpen(true);
			// задержка чтобы input успел появиться
			setTimeout(() => inputRef.current?.focus?.(), 30);
		}
	};

	const handleSelect = (opt: SelectOption) => {
		onSelect(opt);
		setOpen(false);
		setQuery('');
	};

	return (
		<View style={styles.wrapper}>
			{label && <AppText style={styles.label}>{label}</AppText>}
			<View style={[styles.container, open && styles.containerOpen, isInvalid && styles.invalid]}>        
				<Pressable style={styles.fieldRow} onPress={toggle} accessibilityRole="button">
					<AppText
						style={[styles.valueText, !selected && styles.placeholder]}
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
				{open && (
					<View style={styles.dropdownArea}>
						<View style={styles.searchRow}>
																			<AppTextInput
																				ref={node => {
																					if (node) inputRef.current = node as unknown as { focus?: () => void };
																				}}
								value={query}
								onChangeText={setQuery}
								placeholder={placeholder}
								placeholderTextColor={Colors.placeHolderInput}
								style={styles.searchInput}
								autoCapitalize="none"
								autoCorrect={false}
								returnKeyType="done"
							/>
						</View>
						<View style={styles.listHolder}>
							<DropdownList
								filteredOptions={filtered}
								value={value}
								onSelect={handleSelect}
							/>
						</View>
					</View>
				)}
				{open && <View pointerEvents="none" style={styles.activeOverlay} />}
			</View>
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
	},
	containerOpen: {
		// можно поменять цвет рамки при открытии
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
	dropdownArea: {
		borderTopWidth: 1,
		borderTopColor: Colors.inputOptionBorder,
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
	listHolder: {
		maxHeight: MAX_INLINE_HEIGHT,
	},
		activeOverlay: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			height: 54,
			backgroundColor: Colors.black + '08', // тонкий затемняющий слой
		},
});
