import React from 'react';
import { StyleSheet, View } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';

import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppButton, AppText } from '@/shared/ui';

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
		<Popover
			isVisible={visible}
			onRequestClose={onClose}
			placement={PopoverPlacement.CENTER}
			arrowSize={{ width: 0, height: 0 }}
			backgroundStyle={styles.overlay}
			popoverStyle={styles.menuContainer}
		>
			<View
				testID='profile-edit-popover'
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
						paddingHorizontal={24}
						paddingVertical={10}
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
						paddingHorizontal={24}
						paddingVertical={10}
					/>
				</View>
			</View>
		</Popover>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: 'row',
		gap: 16,
		justifyContent: 'center',
	},
	buttonContent: {
		height: 44,
	},
	menuContainer: {
		alignItems: 'center',
		backgroundColor: Colors.white,
		borderRadius: Radius.r15,
		boxShadow: Shadows.boxShadow,
		gap: 12,
		justifyContent: 'center',
		paddingHorizontal: 16,
		paddingVertical: 20,
	},
	overlay: {
		backgroundColor: Colors.shadowButton,
	},
	textOverlay: {
		color: Colors.grayTextOverlay,
		marginBottom: 16,
		textAlign: 'center',
	},
});
