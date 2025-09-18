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
	menuContainer: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		boxShadow: Shadows.boxShadow,
		gap: 12,
		justifyContent: 'center',
		paddingHorizontal: 10,
		paddingVertical: 16,
		width: 252,
	},
	overlay: {
		alignItems: 'center',
		backgroundColor: Colors.shadowButton,
		flex: 1,
		justifyContent: 'center',
	},
	textOverlay: {
		color: Colors.grayTextOverlay,
	},
});
