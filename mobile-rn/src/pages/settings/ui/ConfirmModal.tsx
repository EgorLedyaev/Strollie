import React from 'react';

import { Colors } from '@/shared/tokens';
import { ConfirmPopover } from '@/shared/ui';

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

	const cancelButtonColor =
		primaryButton === 'green' ? Colors.greenPrimary : Colors.grayBackground;
	const cancelTextColor =
		primaryButton === 'green' ? Colors.white : Colors.greenPrimary;

	return (
		<ConfirmPopover
			visible={isVisible}
			title={title}
			onRequestClose={onClose}
			testID='settings-confirm-popover'
			cancelButton={{
				text: cancelText,
				onPress: onClose,
				buttonColor: cancelButtonColor,
				textColor: cancelTextColor,
			}}
			confirmButton={{
				text: confirmText,
				onPress: handleConfirm,
			}}
		/>
	);
};
