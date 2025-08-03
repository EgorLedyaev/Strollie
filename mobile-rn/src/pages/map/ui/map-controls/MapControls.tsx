import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';

import { CenterOnUserButton } from './CenterOnUserButton';
import { ProfileButton } from './ProfileButton';
import { SearchInput } from './SearchInput';
import { ToggleModeButton } from './ToggleModeButton';
import { ZoomButtons } from './ZoomButtons';

interface MapControlsProps {
	onZoomIn: () => void;
	onZoomOut: () => void;
	onToggleMode: () => void;
	onNavigate: () => void;
	onSearchResultSelect: (
		coordinates: [number, number],
		addressText: string,
	) => void;
	is3DMode: boolean;
	mapReady: boolean;
	isLocationAvailable: boolean;
}

export const MapControls: React.FC<MapControlsProps> = props => {
	return (
		<View style={styles.overlayContainer} pointerEvents='box-none'>
			<View style={styles.header} pointerEvents='box-none'>
				<View style={styles.searchBarContainer}>
					<View style={styles.searchIconContainer}>
						<ProfileButton
							href={'/profile'}
							pointerEvents={'auto'}
						/>
					</View>
					<SearchInput
						onSearchResultSelect={props.onSearchResultSelect}
					/>
				</View>
			</View>
			{/* Компонент погоды перенесен в основной экран */}
			<View style={styles.mapControlsWrapper} pointerEvents='box-none'>
				<View style={styles.zoomAndModeContainer}>
					<ZoomButtons
						onZoomIn={props.onZoomIn}
						onZoomOut={props.onZoomOut}
					/>
					<ToggleModeButton
						is3D={props.is3DMode}
						onPress={props.onToggleMode}
						disabled={!props.mapReady}
					/>
					<View/>
					<CenterOnUserButton
						onPress={props.onNavigate}
						disabled={!props.mapReady || !props.isLocationAvailable}
						style={styles.mapButton}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	overlayContainer: {
		...StyleSheet.absoluteFillObject,
		pointerEvents: 'box-none',
	},
	header: {
		paddingHorizontal: 16,
		paddingTop: Platform.OS === 'ios' ? 50 : 40, // Адаптивный отступ сверху
	},
	searchBarContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	searchIconContainer: {
		width: 45,
		height: 45,
	},
	mapControlsWrapper: {
		position: 'absolute',
		right: 16,
		top: 0,
		bottom: 0,
		justifyContent: 'center',
	},
	zoomAndModeContainer: {
		gap: Gaps.g8,
		pointerEvents: 'auto',
		
	},
	mapButton: {
		width: 46,
		height: 46,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 3,
	},
});
