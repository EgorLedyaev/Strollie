import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { ProfileButton } from '@/src/features/layout/ui/ProfileButton/ProfileButton';
import { SearchInput } from '@/src/features/search/ui/SearchInput';
import { Gaps, Radius, Colors, Fonts } from '@/src/shared/tokens';
import PlusIcon from '@/assets/icons/map/PlusIcon';
import MinusIcon from '@/assets/icons/map/MinusIcon';
import LocationIcon from '@/assets/icons/map/LocationIcon';

interface MapControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onToggleMode: () => void;
    onNavigate: () => void;
    onSearchResultSelect: (coordinates: [number, number], addressText: string) => void;
    is3DMode: boolean;
    mapReady: boolean;
    isLocationAvailable: boolean;
}

export const MapControls: React.FC<MapControlsProps> = (props) => {
    return (
        <View style={styles.overlayContainer} pointerEvents="box-none">
            <View style={styles.header} pointerEvents="box-none">
                <ProfileButton href={'/profile'} pointerEvents={'auto'} />
                <SearchInput onSearchResultSelect={props.onSearchResultSelect} />
            </View>
            <View style={styles.mapControlsWrapper} pointerEvents="auto">
                <View style={styles.zoomAndModeContainer}>
                    <View style={styles.mapControls}>
                        <TouchableOpacity style={[styles.mapButton, styles.mapButtonPlus]} onPress={props.onZoomIn} disabled={!props.mapReady}>
                            <PlusIcon />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.mapButton, styles.mapButtonMinus]} onPress={props.onZoomOut} disabled={!props.mapReady}>
                            <MinusIcon />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={[styles.mapButton, props.is3DMode && styles.activeButton]}
                        onPress={props.onToggleMode}
                        disabled={!props.mapReady}
                    >
                        <Text style={[styles.mapButtonText, props.is3DMode && styles.activeButtonText]}>
                            {props.is3DMode ? '3D' : '2D'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.mapButton}
                        onPress={props.onNavigate}
                        disabled={!props.mapReady || !props.isLocationAvailable}
                    >
                        <LocationIcon width={24} height={24} />
                    </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 40, // Адаптивный отступ сверху
        gap: 10,
    },
    mapControlsWrapper: {
        position: 'absolute',
        top: '45%',
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
    mapButtonPlus: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
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
    activeButtonText: { color: Colors.white },
});
