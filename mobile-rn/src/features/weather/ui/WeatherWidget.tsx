import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, Radius } from '@/src/shared/tokens';

interface WeatherWidgetProps {
    temperature: number;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ temperature }) => {
    return (
        <View style={styles.container}>
            <View style={styles.sun} />
            <Text style={styles.temperature}>{temperature > 0 ? `+${temperature}°` : `${temperature}°`}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.greenSecondary,
        borderRadius: Radius.r15,
        width: 100,
        height: 46,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 10,
        overflow: 'hidden',
    },
    sun: {
        position: 'absolute',
        left: -30,
        top: -10,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF96C',
    },
    temperature: {
        fontSize: 20,
        fontFamily: Fonts.medium,
        color: Colors.white,
    },
});
