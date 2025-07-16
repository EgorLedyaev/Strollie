import LocationIcon from '@/assets/icons/map/LocationIcon';
import MinusIcon from '@/assets/icons/map/MinusIcon';
import PlusIcon from '@/assets/icons/map/PlusIcon';
import { ProfileButton } from '@/src/features/layout/ui/ProfileButton/ProfileButton';
import {
	SearchInput,
	SearchInputProps,
} from '@/src/features/search/ui/SearchInput';
import { Colors, Fonts, Gaps, Radius } from '@/src/shared/tokens';
import { LinkProps } from 'expo-router';
import React from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MapControlsOverlayProps {
	is3DMode: boolean;
	mapReady: boolean;
	isLocationAvailable: boolean;
	onZoomIn: () => void;
	onZoomOut: () => void;
	onToggleMode: () => void;
	onNavigate: () => void;
	profileHref?: LinkProps['href'];
	onSearchResultSelect: (coordinates: [number, number], addressText: string) => void; // [lon, lat]
}

export const MapControlsOverlay: React.FC<MapControlsOverlayProps> = ({
	is3DMode,
	mapReady,
	isLocationAvailable,
	onZoomIn,
	onZoomOut,
	onToggleMode,
	onNavigate,
	profileHref = '/profile', // Значение по умолчанию
	onSearchResultSelect,
}) => {
	return (
		<SafeAreaView
			style={styles.overlayContainer}
			pointerEvents='box-none'
			edges={['top', 'left', 'right']}
		>
			{/* Шапка */}
			<View style={styles.header} pointerEvents='box-none'>
				<ProfileButton href={profileHref} pointerEvents='auto' />
				<SearchInput onSearchResultSelect={onSearchResultSelect} />
				{/*<View style={styles.headerSpacer} pointerEvents='none' />*/}
			</View>

			{/* Контролы карты */}
			<View style={styles.mapControlsWrapper} pointerEvents='box-none'>
				{/* +/- */}
				<View style={styles.mapControls} pointerEvents='auto'>
					<TouchableOpacity
						style={[styles.mapButton, styles.mapButtonPlus]}
						onPress={onZoomIn}
						disabled={!mapReady}
					>
						<PlusIcon />
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.mapButton, styles.mapButtonMinus]}
						onPress={onZoomOut}
						disabled={!mapReady}
					>
						<MinusIcon />
					</TouchableOpacity>
				</View>
				{/* 2D/3D и Навигация */}
				<View style={styles.mapModeControls} pointerEvents='box-none'>
					<TouchableOpacity
						style={[
							styles.mapButton,
							is3DMode ? styles.activeButton : {},
						]}
						onPress={onToggleMode}
						disabled={!mapReady}
					>
						<Text
							style={[
								styles.mapButtonText,
								is3DMode ? styles.activeButtonText : {},
							]}
						>
							{is3DMode ? '3D' : '2D'}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.mapButton}
						onPress={onNavigate}
						disabled={!mapReady || !isLocationAvailable}
					>
						<LocationIcon width={24} height={24} />
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

// Стили можно скопировать из MapScreen.tsx и немного адаптировать
const styles = StyleSheet.create({
	overlayContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		pointerEvents: 'box-none',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: Platform.OS === 'ios' ? 0 : 10, // Учитываем SafeAreaView
		gap: 10,
	},
	headerSpacer: { flex: 1 },
	mapControlsWrapper: {
		position: 'absolute',
		top: '40%',
		right: 16,
		alignItems: 'flex-end',
		gap: Gaps.g16,
	},
	mapControls: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 3,
	},
	mapModeControls: { gap: Gaps.g16, alignItems: 'flex-end' },
	mapButton: {
		width: 46,
		height: 46,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 3,
	},
	mapButtonPlus: {
		borderBottomRightRadius: 0,
		borderBottomLeftRadius: 0,
		shadowOffset: { width: 0, height: 0 },
		elevation: 0,
	},
	mapButtonMinus: {
		borderTopRightRadius: 0,
		borderTopLeftRadius: 0,
		borderTopWidth: 1,
		borderTopColor: Colors.gray,
	},
	activeButton: { backgroundColor: Colors.greenPrimary },
	mapButtonText: {
		fontSize: 16,
		fontFamily: Fonts.regular,
		color: Colors.black,
	},
	activeButtonText: { color: Colors.white }, // Белый текст на зеленом фоне
});
