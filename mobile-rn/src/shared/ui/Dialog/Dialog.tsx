import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors, Shadows } from '../../tokens';
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
	overlay: {
		flex: 1,
		backgroundColor: Colors.modalOverlay, // Полупрозрачный оверлей
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		width: '80%',
		maxWidth: 400,
	},
	dialog: {
		backgroundColor: Colors.white,
		borderRadius: 16,
		padding: 20,
		boxShadow: Shadows.boxShadow_elev2,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
		color: Colors.headerAndInputText,
		textAlign: 'center',
	},
	content: {
		marginBottom: 24,
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
});
