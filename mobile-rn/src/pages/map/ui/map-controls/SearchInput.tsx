import React, { useCallback, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	Platform,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

import {
	fetchPlaceDetailsById,
	PlacesAPIResult,
	SuggestItem,
	suggestPlaces,
} from '@/shared/api';
import { Colors, Fonts, Gaps, Radius, Shadows } from '@/shared/tokens';
import { AppText, AppTextInput } from '@/shared/ui';

export interface SearchInputProps {
	onSearchResultSelect: (
		coordinates: [number, number], // [lon, lat]
		addressText: string,
	) => void;
	style?: object | undefined; // Дополнительные стили для кастомизации
}

type UnifiedResult = (PlacesAPIResult | SuggestItem) & {
	point?: { lon: number; lat: number };
};

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
		// NEW: use suggest API instead of direct geocode
		const suggestions = await suggestPlaces(query, 10);
		if (suggestions.length > 0) {
			setSearchResults(suggestions as unknown as PlacesAPIResult[]);
		} else {
			setSearchResults([]);
			setSearchError('Ничего не найдено');
		}
		setIsSearching(false);
	}, []);

	const handleSelectResult = async (item: UnifiedResult) => {
		let point = item.point;
		let addressText = item.full_name || item.name;

		if (!point) {
			// try fetch details by id via byid endpoint
			const detailed = await fetchPlaceDetailsById(item.id);
			if (detailed && detailed.point) {
				point = detailed.point;
				addressText = detailed.full_name || detailed.name;
			} else {
				console.warn(
					'Нет координат после детализации suggest',
					item.id,
				);
				setSearchError('Не удалось получить координаты места');
				setSearchResults([]);
				return;
			}
		}

		const coordinates: [number, number] = [point.lon, point.lat];
		console.log(
			'[RN Search] Выбрано место (suggest):',
			addressText,
			coordinates,
		);
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
							{(item as UnifiedResult).address_name && (
								<AppText
									style={styles.searchResultDescription}
									numberOfLines={1}
								>
									{(item as UnifiedResult).address_name}
								</AppText>
							)}
						</TouchableOpacity>
					)}
					style={styles.searchResultsList}
					keyboardShouldPersistTaps='handled'
				/>
			)}
			{isFocused &&
				searchError &&
				!isSearching &&
				searchQuery.length >= 3 && (
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
	searchErrorText: {
		color: Colors.error,
		padding: Gaps.g16,
		textAlign: 'center',
	},
	searchInput: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		boxShadow: Shadows.boxShadow,
		color: Colors.black,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
		height: 45,
		paddingHorizontal: Gaps.g16,
		paddingVertical: Platform.OS === 'ios' ? 14 : 10,
	},
	searchLoader: {
		position: 'absolute',
		right: 10,
		top: Platform.OS === 'ios' ? 12 : 10,
	},
	searchResultDescription: {
		color: Colors.darkGray,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f14,
	},
	searchResultItem: {
		borderBottomColor: Colors.lightGray,
		borderBottomWidth: 1,
		paddingHorizontal: Gaps.g16,
		paddingVertical: Gaps.g12,
	},
	searchResultName: {
		color: Colors.black,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
	},
	searchResultsList: {
		backgroundColor: Colors.white,
		borderColor: Colors.gray,
		borderRadius: Radius.r10,
		borderWidth: 1,
		left: 0,
		maxHeight: 250,
		position: 'absolute',
		right: 0,
		top: Platform.OS === 'ios' ? 50 : 46,
		zIndex: 100,
	},
});
