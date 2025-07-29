import React from 'react';
import { TouchableOpacity } from 'react-native';
import LocationIcon from '@/assets/icons/map/LocationIcon';

export const CenterOnUserButton = ({ onPress, disabled, style }: { onPress: () => void; disabled: boolean; style?: any }) => (
    <TouchableOpacity style={style} onPress={onPress} disabled={disabled}>
        <LocationIcon width={24} height={24} />
    </TouchableOpacity>
);
