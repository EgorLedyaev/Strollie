import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppButton, AppText, IconButton } from '@/shared/ui';

interface ProfileMenuOverlayProps {
	visible: boolean;
	onClose: () => void;
    onSave: () => void;
    isLoading: boolean;
	onCancel: () => void;
}

export const ProfileEditOverlay: React.FC<ProfileMenuOverlayProps> = ({
	visible,
	onClose,
    onSave,
    isLoading,
	onCancel,
}) => {
	return (
		<Modal
			visible={visible}
			transparent
			animationType='fade'
			onRequestClose={onClose}
			statusBarTranslucent
		>
			<IconButton
				style={styles.overlay}
				onPress={onClose}
				feedback='opacity'
				opacity={1}
			>
				<View
					style={styles.menuContainer}
					onStartShouldSetResponder={() => true}
				>
					<AppText style={styles.textOverlay}>
						Сохранить изменения?
					</AppText>
					<View style={styles.buttonContainer}>
						<AppButton
							onPress={onCancel}
							text={'Отменить'}
							style={styles.buttonContent}
							variant='secondary'
							buttonBorderRadius={Radius.r10}
							textFontFamily={Fonts.regular}
							textFontSize={Fonts.f16}
							textColor={Colors.grayTextButtonOverlay}
						/>
						<AppButton
							onPress={onSave}
							text={'Сохранить'}
							style={styles.buttonContent}
							variant='secondary'
							buttonBorderRadius={Radius.r10}
							textFontFamily={Fonts.regular}
							buttonColor={Colors.successGreen}
							textFontSize={Fonts.f16}
                            dimFactor={0.75}
                            isLoading={isLoading}
                            sizeActivityIndicator={'small'}
						/>
					</View>
				</View>
			</IconButton>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: Colors.shadowButton,
		justifyContent: 'center',
		alignItems: 'center',
	},
	menuContainer: {
		width: 252,
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		boxShadow: Shadows.boxShadow,
		paddingVertical: 16,
		paddingHorizontal: 10,
		gap: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textOverlay: {
		color: Colors.grayTextOverlay,
	},
	buttonContainer: {
		flexDirection: 'row',
		gap: 10,
		justifyContent: 'center',
		// justifyContent: 'space-between',
	},
	buttonContent: {
		height: 39,
		width: 111,
	},
});
