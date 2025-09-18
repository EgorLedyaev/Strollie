import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Colors } from '@/shared/tokens';
import { AppButton, AppText } from '@/shared/ui';
import { Dialog } from '@/shared/ui/Dialog';

interface Props {
	visible: boolean;
	onClose: () => void;
	qrUri?: string;
	title?: string;
	subtitle?: string;
}

export const ShowTicketQrDialog: React.FC<Props> = ({
	visible,
	onClose,
	qrUri,
	title = 'QR код билета',
	subtitle,
}) => {
	return (
		<Dialog
			visible={visible}
			onClose={onClose}
			title={title}
			actions={
				<AppButton
					onPress={onClose}
					variant='outline'
					text='Закрыть'
					textColor=''
					style={styles.appButton}
				/>
			}
		>
			<View style={styles.container}>
				{subtitle ? (
					<AppText style={styles.subtitle}>{subtitle}</AppText>
				) : null}
				<View style={styles.qrWrap}>
					{qrUri ? (
						<Image
							source={{ uri: qrUri }}
							style={styles.qr}
							resizeMode='contain'
						/>
					) : (
						<View style={styles.qrPlaceholder} />
					)}
				</View>
			</View>
		</Dialog>
	);
};

const styles = StyleSheet.create({
	appButton: {
		height: 43,
	},
	container: { gap: 12 },
	qr: { height: 240, width: 240 },
	qrPlaceholder: {
		backgroundColor: Colors.gray,
		borderRadius: 8,
		height: 240,
		width: 240,
	},
	qrWrap: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 8,
	},

	subtitle: { color: Colors.secondaryText },
});
