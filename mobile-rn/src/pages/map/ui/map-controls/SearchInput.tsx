import { geocodeAddress, PlacesAPIResult } from '@/shared/api';
import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import React, { useCallback, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

export interface SearchInputProps {
	onSearchResultSelect: (
		coordinates: [number, number], // [lon, lat]
		addressText: string,
	) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
	onSearchResultSelect,
}) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<PlacesAPIResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [searchError, setSearchError] = useState<string | null>(null);

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
		<View style={styles.searchContainer}>
			<TextInput
				style={styles.searchInput}
				placeholder='Поиск и выбор мест'
				placeholderTextColor={Colors.lightGray}
				value={searchQuery}
				onChangeText={handleSearch}
				onFocus={() => {
					if (
						searchQuery.length >= 3 &&
						searchResults.length === 0 &&
						!isSearching
					)
						handleSearch(searchQuery);
				}}
			/>
			{isSearching && (
				<ActivityIndicator
					style={styles.searchLoader}
					size='small'
					color={Colors.greenPrimary}
				/>
			)}
			{searchResults.length > 0 && (
				<FlatList
					data={searchResults}
					keyExtractor={item => item.id}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() => handleSelectResult(item)}
							style={styles.searchResultItem}
						>
							<Text style={styles.searchResultName}>
								{item.name}
							</Text>
							{item.address_name && (
								<Text
									style={styles.searchResultDescription}
									numberOfLines={1}
								>
									{item.address_name}
								</Text>
							)}
						</TouchableOpacity>
					)}
					style={styles.searchResultsList}
					keyboardShouldPersistTaps='handled'
				/>
			)}
			{searchError && !isSearching && searchQuery.length >= 3 && (
				<View style={styles.searchResultsList}>
					<Text style={styles.searchErrorText}>{searchError}</Text>
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
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
		includeFontPadding: false,
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
		elevation: 3,
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
