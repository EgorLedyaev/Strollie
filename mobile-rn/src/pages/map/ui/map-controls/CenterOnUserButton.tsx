import LocationIcon from '@/assets/icons/map/LocationIcon';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { ActionTouchable } from '@/shared/ui';

export const CenterOnUserButton = ({
	onPress,
	disabled,
	style,
}: {
	onPress: () => void;
	disabled: boolean;
	style?: StyleProp<ViewStyle>;
}) => (
	<ActionTouchable style={style} onPress={onPress} disabled={disabled}>
		<LocationIcon width={24} height={24} />
	</ActionTouchable>
);
