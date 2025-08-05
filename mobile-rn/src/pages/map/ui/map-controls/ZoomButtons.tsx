import { MinusIcon, PlusIcon } from '@/assets/icons/map';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors, Radius, Shadows } from '@/shared/tokens';
import { IconButton } from '@/shared/ui';

export const ZoomButtons = ({
	onZoomIn,
	onZoomOut,
}: {
	onZoomIn: () => void;
	onZoomOut: () => void;
}) => (
	<View style={styles.container}>
		<IconButton
			style={{ ...styles.button, ...styles.plusIcon }}
			onPress={onZoomIn}
		>
			<PlusIcon />
		</IconButton>
		<IconButton
			style={{ ...styles.button, ...styles.minusIcon }}
			onPress={onZoomOut}
		>
			<MinusIcon />
		</IconButton>
	</View>
);

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		gap: 3,
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.white,
		width: 46,
		height: 46,
		boxShadow: Shadows.boxShadow,
	},
	plusIcon: {
		borderTopStartRadius: Radius.r16,
		borderTopEndRadius: Radius.r16,
	},
	minusIcon: {
		borderBottomStartRadius: Radius.r16,
		borderBottomEndRadius: Radius.r16,
	},
});
