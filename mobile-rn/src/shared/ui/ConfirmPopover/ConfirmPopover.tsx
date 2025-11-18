import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';

import { Colors, Fonts, Radius, Shadows } from '@/shared/tokens';
import { AppButton, AppButtonProps } from '@/shared/ui/Button';
import { AppText } from '@/shared/ui/Text';

type ConfirmPopoverButton = Pick<
	AppButtonProps,
	| 'variant'
	| 'buttonColor'
	| 'textColor'
	| 'textFontFamily'
	| 'textFontSize'
	| 'dimFactor'
	| 'isLoading'
	| 'disabled'
> & {
	text: string;
	onPress: () => void;
};

export interface ConfirmPopoverProps {
	visible: boolean;
	title: string;
	onRequestClose: () => void;
	cancelButton: ConfirmPopoverButton;
	confirmButton: ConfirmPopoverButton;
	placement?: PopoverPlacement;
	backgroundStyle?: ViewStyle;
	contentStyle?: ViewStyle;
	testID?: string;
}

export const ConfirmPopover: React.FC<ConfirmPopoverProps> = ({
	visible,
	title,
	onRequestClose,
	cancelButton,
	confirmButton,
	placement = PopoverPlacement.CENTER,
	backgroundStyle,
	contentStyle,
	testID = 'confirm-popover',
}) => {
	return (
		<Popover
			isVisible={visible}
			onRequestClose={onRequestClose}
			placement={placement}
			arrowSize={{ width: 0, height: 0 }}
			backgroundStyle={[styles.overlay, backgroundStyle]}
			popoverStyle={[styles.container, contentStyle]}
		>
			<View testID={testID} onStartShouldSetResponder={() => true}>
				<AppText style={styles.title}>{title}</AppText>
				<View style={styles.buttonsContainer}>
					<AppButton
						text={cancelButton.text}
						variant={cancelButton.variant ?? 'secondary'}
						buttonColor={
							cancelButton.buttonColor ?? Colors.grayBackground
						}
						textColor={cancelButton.textColor ?? Colors.textAAA}
						textFontFamily={
							cancelButton.textFontFamily ?? Fonts.regular
						}
						textFontSize={cancelButton.textFontSize ?? Fonts.f16}
						dimFactor={cancelButton.dimFactor}
						isLoading={cancelButton.isLoading}
						disabled={cancelButton.disabled}
						onPress={cancelButton.onPress}
						buttonBorderRadius={Radius.r10}
						style={styles.button}
						paddingHorizontal={24}
						paddingVertical={10}
					/>
					<AppButton
						text={confirmButton.text}
						variant={confirmButton.variant ?? 'secondary'}
						buttonColor={
							confirmButton.buttonColor ?? Colors.grayBackground
						}
						textColor={confirmButton.textColor ?? Colors.textAAA}
						textFontFamily={
							confirmButton.textFontFamily ?? Fonts.regular
						}
						textFontSize={confirmButton.textFontSize ?? Fonts.f16}
						dimFactor={confirmButton.dimFactor}
						isLoading={confirmButton.isLoading}
						disabled={confirmButton.disabled}
						onPress={confirmButton.onPress}
						buttonBorderRadius={Radius.r10}
						style={styles.button}
						paddingHorizontal={24}
						paddingVertical={10}
					/>
				</View>
			</View>
		</Popover>
	);
};

const styles = StyleSheet.create({
	button: {
		height: 44,
	},
	buttonsContainer: {
		flexDirection: 'row',
		gap: 16,
		justifyContent: 'center',
	},
	container: {
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
	title: {
		color: Colors.grayTextOverlay,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
		marginBottom: 16,
		textAlign: 'center',
	},
});
