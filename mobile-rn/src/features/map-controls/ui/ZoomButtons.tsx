import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/src/shared/tokens';

export const ZoomButtons = ({ onZoomIn, onZoomOut }: { onZoomIn: () => void; onZoomOut: () => void }) => (
    <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={onZoomIn}>
            <Text style={styles.text}>+</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.button} onPress={onZoomOut}>
            <Text style={styles.text}>-</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: Colors.white,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    button: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: Fonts.semibold,
        fontSize: 20,
        color: Colors.black,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.lightGray,
    },
});
