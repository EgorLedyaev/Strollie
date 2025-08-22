import React, { useCallback, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	Platform,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

import { geocodeAddress, PlacesAPIResult } from '@/shared/api';
import { Colors, Fonts, Gaps, Radius, Shadows } from '@/shared/tokens';
import { AppText, AppTextInput } from '@/shared/ui';

export interface SearchInputProps {
	onSearchResultSelect: (
		coordinates: [number, number], // [lon, lat]
		addressText: string,
	) => void;
	style?: object | undefined; // Дополнительные стили для кастомизации
}

export const SearchInput: React.FC<SearchInputProps> = ({
	onSearchResultSelect,
	style,
}) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<PlacesAPIResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [searchError, setSearchError] = useState<string | null>(null);
	const [isFocused, setIsFocused] = useState(false);

	const handleSearch = useCallback(async (query: string) => {
		setSearchQuery(query);
		if (query.length < 3) {
			setSearchResults([]);
			setSearchError(null);
			return;
		}
		setIsSearching(true);
		setSearchError(null);
		const data = await geocodeAddress(query);
		if (data && data.result && data.result.items.length > 0) {
			setSearchResults(data.result.items);
		} else {
			setSearchResults([]);
			if (data) setSearchError('Ничего не найдено');
			else setSearchError('Ошибка поиска');
		}
		setIsSearching(false);
	}, []);

	const handleSelectResult = (item: PlacesAPIResult) => {
		if (!item.point) {
			console.warn('Выбранный результат не имеет координат:', item);
			setSearchError('У выбранного места нет точных координат.');
			setSearchResults([]);
			return;
		}
		const coordinates: [number, number] = [item.point.lon, item.point.lat];
		const addressText = item.full_name || item.name;

		console.log('[RN Search] Выбрано место:', addressText, coordinates);
		onSearchResultSelect(coordinates, addressText);
		setSearchQuery(addressText);
		setSearchResults([]);
	};

	return (
		<View style={[styles.searchContainer, style]}>
			<AppTextInput
				style={styles.searchInput}
				placeholder='Поиск и выбор мест'
				placeholderTextColor={Colors.lightGray}
				value={searchQuery}
				onChangeText={handleSearch}
				onFocus={() => {
					setIsFocused(true);
					if (
						searchQuery.length >= 3 &&
						searchResults.length === 0 &&
						!isSearching
					) {
						handleSearch(searchQuery);
					}
				}}
				onBlur={() => {
					// Сворачиваем результаты при потере фокуса
					setIsFocused(false);
				}}
			/>
			{isSearching && (
				<ActivityIndicator
					style={styles.searchLoader}
					size='small'
					color={Colors.greenPrimary}
				/>
			)}
			{isFocused && searchResults.length > 0 && (
				<FlatList
					data={searchResults}
					keyExtractor={item => item.id}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() => handleSelectResult(item)}
							style={styles.searchResultItem}
						>
							<AppText style={styles.searchResultName}>
								{item.name}
							</AppText>
							{item.address_name && (
								<AppText
									style={styles.searchResultDescription}
									numberOfLines={1}
								>
									{item.address_name}
								</AppText>
							)}
						</TouchableOpacity>
					)}
					style={styles.searchResultsList}
					keyboardShouldPersistTaps='handled'
				/>
			)}
			{isFocused && searchError && !isSearching && searchQuery.length >= 3 && (
				<View style={styles.searchResultsList}>
					<AppText style={styles.searchErrorText}>
						{searchError}
					</AppText>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	searchContainer: {
		flex: 1,
		position: 'relative',
	},
	searchInput: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		paddingHorizontal: Gaps.g16,
		paddingVertical: Platform.OS === 'ios' ? 14 : 10,
		fontSize: Fonts.f14,
		fontFamily: Fonts.regular,
		color: Colors.black,
		height: 45,
		boxShadow: Shadows.boxShadow,
	},
	searchLoader: {
		position: 'absolute',
		right: 10,
		top: Platform.OS === 'ios' ? 12 : 10,
	},
	searchResultsList: {
		position: 'absolute',
		top: Platform.OS === 'ios' ? 50 : 46,
		left: 0,
		right: 0,
		backgroundColor: Colors.white,
		borderRadius: Radius.r10,
		maxHeight: 250,
		borderColor: Colors.gray,
		borderWidth: 1,
		zIndex: 100,
	},
	searchResultItem: {
		paddingHorizontal: Gaps.g16,
		paddingVertical: Gaps.g12,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightGray,
	},
	searchResultName: {
		fontSize: Fonts.f16,
		fontFamily: Fonts.semibold,
		color: Colors.black,
	},
	searchResultDescription: {
		fontSize: Fonts.f14,
		fontFamily: Fonts.regular,
		color: Colors.darkGray,
	},
	searchErrorText: {
		padding: Gaps.g16,
		color: Colors.error,
		textAlign: 'center',
	},
});
