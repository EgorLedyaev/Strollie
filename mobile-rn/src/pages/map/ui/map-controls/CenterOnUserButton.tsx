import LocationIcon from '@/assets/icons/map/LocationIcon';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export const CenterOnUserButton = ({
	onPress,
	disabled,
	style,
}: {
	onPress: () => void;
	disabled: boolean;
	style?: any;
}) => (
	<TouchableOpacity style={style} onPress={onPress} disabled={disabled}>
		<LocationIcon width={24} height={24} />
	</TouchableOpacity>
);
