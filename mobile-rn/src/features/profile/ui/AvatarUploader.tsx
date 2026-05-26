import EditPhotoIcon from '@/assets/icons/EditPhotoIcon';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { updateUserProfileAtom, userProfileAtom } from '@/entities/user';
import { useAnchorMeasurement } from '@/shared/lib';
import { Colors } from '@/shared/tokens';
import { ActionTouchable, Avatar } from '@/shared/ui';

import { useUploadAvatar } from '../model/useUploadAvatar';
import { AvatarPhotoOptionsModal } from './AvatarPhotoOptionsModal';

interface AvatarUploaderProps {
	size?: number;
	value?: string | null;
	onAvatarChange?: (uri: string | null) => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
	size = 100,
	value,
	onAvatarChange,
}) => {
	const { uploadAvatar, takePhoto, isLoading, avatarUrl } = useUploadAvatar();
	const profileState = useAtomValue(userProfileAtom);
	const updateUser = useSetAtom(updateUserProfileAtom);
	const [optionsVisible, setOptionsVisible] = useState(false);
	const { ref: anchorRef, anchor, measure } = useAnchorMeasurement();

	const openOptions = async () => {
		await measure();
		requestAnimationFrame(() => setOptionsVisible(true));
	};
	const closeOptions = () => setOptionsVisible(false);

	const handlePickFromDevice = async () => {
		const uri = await uploadAvatar();
		if (onAvatarChange) onAvatarChange(uri);
		closeOptions();
	};

	const handleTakePhoto = async () => {
		const uri = await takePhoto();
		if (onAvatarChange) onAvatarChange(uri);
		closeOptions();
	};

	const handleRemove = () => {
		if (profileState?.profile) {
			updateUser({ ...profileState.profile, photo: undefined });
		}
		if (onAvatarChange) onAvatarChange(null);
		closeOptions();
	};

	/* no test hooks – visibility controlled only by user action */

	return (
		<View style={styles.container}>
			<View
				ref={anchorRef}
				collapsable={false}
				testID='avatar-photo-menu-trigger'
			>
				<ActionTouchable
					testID='avatar-photo-menu-button'
					onPress={openOptions}
					disabled={isLoading}
					style={[styles.avatarContainer, { borderRadius: size / 2 }]}
				>
					<Avatar uri={value ?? avatarUrl} size={size} />
					{/* Полупрозрачный overlay поверх аватара */}
					<View
						pointerEvents='none'
						style={[
							StyleSheet.absoluteFillObject,
							styles.overlay,
							{ borderRadius: size / 2 },
						]}
					/>
					<View style={styles.iconContainer} pointerEvents='none'>
						<EditPhotoIcon />
					</View>
				</ActionTouchable>
			</View>
			<AvatarPhotoOptionsModal
				visible={optionsVisible}
				onClose={closeOptions}
				onPickFromDevice={handlePickFromDevice}
				onTakePhoto={handleTakePhoto}
				onRemove={handleRemove}
				anchor={anchor ?? undefined}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	avatarContainer: {
		position: 'relative',
	},
	container: {
		alignItems: 'center',
	},
	iconContainer: {
		...StyleSheet.absoluteFillObject,
		alignItems: 'center',
		justifyContent: 'center',
	},
	overlay: {
		backgroundColor: Colors.darkImageOverlay,
	},
});
