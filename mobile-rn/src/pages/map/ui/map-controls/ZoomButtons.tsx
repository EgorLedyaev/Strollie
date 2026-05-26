import { MinusIcon, PlusIcon } from '@/assets/icons/map';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors, Radius, Shadows } from '@/shared/tokens';
import { ActionTouchable } from '@/shared/ui';

export const ZoomButtons = ({
	onZoomIn,
	onZoomOut,
}: {
	onZoomIn: () => void;
	onZoomOut: () => void;
}) => (
	<View style={styles.container}>
		<ActionTouchable
			style={{ ...styles.button, ...styles.plusIcon }}
			onPress={onZoomIn}
		>
			<PlusIcon />
		</ActionTouchable>
		<ActionTouchable
			style={{ ...styles.button, ...styles.minusIcon }}
			onPress={onZoomOut}
		>
			<MinusIcon />
		</ActionTouchable>
	</View>
);

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		boxShadow: Shadows.boxShadow,
		height: 46,
		justifyContent: 'center',
		width: 46,
	},
	container: {
		flexDirection: 'column',
		gap: 3,
	},
	minusIcon: {
		borderBottomEndRadius: Radius.r16,
		borderBottomStartRadius: Radius.r16,
	},
	plusIcon: {
		borderTopEndRadius: Radius.r16,
		borderTopStartRadius: Radius.r16,
	},
});
