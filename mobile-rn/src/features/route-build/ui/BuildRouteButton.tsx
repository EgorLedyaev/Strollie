import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Fonts, Radius } from '@/src/shared/tokens';

interface BuildRouteButtonProps {
    onPress: () => void;
    disabled: boolean;
    isBuilding: boolean;
    pointCount: number;
}

export const BuildRouteButton: React.FC<BuildRouteButtonProps> = ({ onPress, disabled, isBuilding, pointCount }) => (
    <TouchableOpacity
        style={[
            styles.buildRouteButton,
            disabled && styles.buttonDisabled,
        ]}
        onPress={onPress}
        disabled={disabled}
    >
        {isBuilding ? (
            <ActivityIndicator color={Colors.white} size='small' />
        ) : (
            <Text style={styles.buildRouteButtonText}>
                Маршрут ({pointCount})
            </Text>
        )}
    </TouchableOpacity>
);


const styles = StyleSheet.create({
	buildRouteButton: {
		backgroundColor: Colors.greenPrimary,
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: Radius.r15,
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		pointerEvents: 'auto',
		minHeight: 48,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonDisabled: {
		backgroundColor: Colors.gray,
	},
	buildRouteButtonText: {
		color: Colors.black,
		fontSize: 16,
		fontFamily: Fonts.semibold,
	},
});
