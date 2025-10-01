import LocationFollowIcon from '@/assets/icons/map/LocationFollowIcon';
import LocationHeadingIcon from '@/assets/icons/map/LocationHeadingIcon';
import LocationIcon from '@/assets/icons/map/LocationIcon';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { IconButton } from '@/shared/ui';

import type { FollowMode } from '../../model/useMapBridge';

export type { FollowMode };

export const NavigationModeButton = ({
	mode,
	onPress,
	disabled,
	style,
}: {
	mode: FollowMode;
	onPress: () => void;
	disabled: boolean;
	style?: StyleProp<ViewStyle>;
}) => {
	const renderIcon = () => {
		switch (mode) {
			case 'center':
				return <LocationFollowIcon />;
			case 'heading':
				return <LocationHeadingIcon />;
			case 'none':
			default:
				return <LocationIcon />;
		}
	};

	return (
		<IconButton style={style} onPress={onPress} disabled={disabled}>
			{renderIcon()}
		</IconButton>
	);
};
