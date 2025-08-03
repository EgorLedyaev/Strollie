import React from 'react';
import {
	Platform,
	StyleSheet,
	View,
} from 'react-native';

import { SearchInput } from '../SearchInput';
import { ProfileButton } from '@/src/features/layout';
import { Colors, Fonts, Gaps, Radius } from '@/src/shared/tokens';
import { ZoomButtons } from './ZoomButtons';
import { ToggleModeButton } from './ToggleModeButton';
import { CenterOnUserButton } from './CenterOnUserButton';


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
			<View style={styles.mapControlsWrapper} pointerEvents='auto'>
				<View style={styles.zoomAndModeContainer}>
					<View style={styles.mapControls}>
						<ZoomButtons
							onZoomIn={props.onZoomIn}
							onZoomOut={props.onZoomOut}
						/>
					</View>
					<ToggleModeButton
						is3D={props.is3DMode}
						onPress={props.onToggleMode}
						disabled={!props.mapReady}
					/>
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
	weatherWrapper: {
		position: 'absolute',
		top: Platform.OS === 'ios' ? 120 : 100,
		left: 16,
	},
	mapControlsWrapper: {
		position: 'absolute',
		top: 280,
		right: 16,
		alignItems: 'flex-end',
	},
	zoomAndModeContainer: {
		gap: Gaps.g16,
		alignItems: 'flex-end',
	},
	mapControls: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 1 },
		gap: 1.5,
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 3,
	},
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
});
