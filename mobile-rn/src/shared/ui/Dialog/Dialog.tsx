import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors, Fonts, Radius, Shadows } from '../../tokens';
import { AppText } from '../Text';

interface DialogProps {
	visible: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	actions: React.ReactNode;
}

export const Dialog = ({
	visible,
	onClose,
	title,
	children,
	actions,
}: DialogProps) => {
	return (
		<Modal
			visible={visible}
			transparent
			animationType='fade'
			onRequestClose={onClose}
			statusBarTranslucent
		>
			<TouchableOpacity
				style={styles.overlay}
				activeOpacity={1}
				onPress={onClose}
			>
				<View
					style={styles.container}
					onStartShouldSetResponder={() => true}
				>
					<View style={styles.dialog}>
						<AppText style={styles.title}>{title}</AppText>
						<View style={styles.content}>{children}</View>
						<View style={styles.actions}>{actions}</View>
					</View>
				</View>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	actions: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	container: {
		maxWidth: 400,
		width: '80%',
	},
	content: {
		marginBottom: 24,
	},
	dialog: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		boxShadow: Shadows.boxShadow_elev2,
		padding: 20,
	},
	overlay: {
		alignItems: 'center',
		backgroundColor: Colors.modalOverlay, // Полупрозрачный оверлей
		flex: 1,
		justifyContent: 'center',
	},
	title: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f18,
		marginBottom: 16,
		textAlign: 'center',
	},
});
