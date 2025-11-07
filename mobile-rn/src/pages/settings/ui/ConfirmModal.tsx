import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Gaps, Radius, Shadows } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

interface ConfirmModalProps {
	isVisible: boolean;
	title: string;
	cancelText: string;
	confirmText: string;
	onClose: () => void;
	onConfirm: () => void;
	primaryButton?: 'green' | 'gray';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
	isVisible,
	title,
	cancelText,
	confirmText,
	onClose,
	onConfirm,
	primaryButton,
}) => {
	const handleConfirm = () => {
		onConfirm();
		onClose();
	};

	return (
		<Modal visible={isVisible} transparent animationType='fade'>
			<Pressable style={styles.overlay} onPress={onClose}>
				<Pressable style={styles.container}>
					<AppText style={styles.title}>{title}</AppText>
					<View style={styles.buttonsContainer}>
						<Pressable
							style={[
								styles.button,
								primaryButton === 'green' && styles.greenButton,
							]}
							onPress={onClose}
						>
							<AppText
								style={[
									styles.buttonText,
									primaryButton === 'green' &&
										styles.greenButtonText,
									primaryButton === 'gray' &&
										styles.grayButtonText,
								]}
							>
								{cancelText}
							</AppText>
						</Pressable>
						<Pressable
							style={styles.button}
							onPress={handleConfirm}
						>
							<AppText style={styles.buttonText}>
								{confirmText}
							</AppText>
						</Pressable>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
};

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r10,
		flex: 1,
		paddingVertical: 14,
	},
	buttonText: {
		color: Colors.textAAA,
		fontSize: Fonts.f16,
	},
	buttonsContainer: {
		flexDirection: 'row',
		gap: Gaps.g10,
		width: '100%',
	},
	container: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r16,
		boxShadow: Shadows.boxShadow_elev2,
		gap: Gaps.g20,
		padding: 24,
		width: 312,
	},
	grayButtonText: { color: Colors.successGreen },
	greenButton: {
		backgroundColor: Colors.successGreen,
	},
	greenButtonText: {
		color: Colors.white,
	},
	overlay: {
		alignItems: 'center',
		backgroundColor: Colors.statusBarOverlay,
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 20,
	},
	title: {
		color: Colors.headerAndInputText,
		fontSize: Fonts.f16,
	},
});
