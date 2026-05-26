import React, { useCallback } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Colors, Gaps, Radius, Shadows } from '@/shared/tokens';

import { NavigationModeButton, type FollowMode } from './NavigationModeButton';
import { ProfileButton } from './ProfileButton';
import { SearchInput } from './SearchInput';
import { ToggleModeButton } from './ToggleModeButton';
import { ZoomButtons } from './ZoomButtons';

interface MapControlsProps {
	onZoomIn: () => void;
	onZoomOut: () => void;
	onToggleMode: () => void;
	onToggleFollowMode: () => void;
	onSearchResultSelect: (
		coordinates: [number, number],
		addressText: string,
	) => void;
	is3DMode: boolean;
	mapReady: boolean;
	isLocationAvailable: boolean;
	followMode: FollowMode;
	onProfilePress?: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
	onZoomIn,
	onZoomOut,
	onToggleMode,
	onToggleFollowMode,
	onSearchResultSelect,
	is3DMode,
	mapReady,
	isLocationAvailable,
	followMode,
	onProfilePress,
}) => {
	const handleProfilePress = useCallback(() => {
		onProfilePress?.();
	}, [onProfilePress]);

	return (
		<View style={styles.overlayContainer} pointerEvents='box-none'>
			<View style={styles.header} pointerEvents='box-none'>
				<ProfileButton
					href={'/profile'}
					pointerEvents={'auto'}
					style={styles.profileButton}
					onPress={handleProfilePress}
				/>
				<SearchInput onSearchResultSelect={onSearchResultSelect} />
			</View>
			{/* Компонент погоды перенесен в основной экран */}
			<View style={styles.mapControlsWrapper} pointerEvents='box-none'>
				<View style={styles.zoomAndModeContainer}>
					<ZoomButtons onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
					<ToggleModeButton
						is3D={is3DMode}
						onPress={onToggleMode}
						disabled={!mapReady}
					/>
					<View />
					<NavigationModeButton
						mode={followMode}
						onPress={onToggleFollowMode}
						disabled={!mapReady || !isLocationAvailable}
						style={styles.mapButton}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 10,
		paddingHorizontal: 16,
		paddingTop: Platform.OS === 'ios' ? 50 : 45, // Адаптивный отступ сверху
	},
	mapButton: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		boxShadow: Shadows.boxShadow,
		height: 46,
		justifyContent: 'center',
		width: 46,
	},
	mapControlsWrapper: {
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		right: 16,
		top: 0,
	},
	overlayContainer: {
		...StyleSheet.absoluteFillObject,
		pointerEvents: 'box-none',
	},
	profileButton: {
		boxShadow: Shadows.boxShadow,
		height: 45,
		width: 45,
	},
	zoomAndModeContainer: {
		gap: Gaps.g8,
		pointerEvents: 'auto',
	},
});
