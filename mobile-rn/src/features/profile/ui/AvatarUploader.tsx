import EditPhotoIcon from '@/assets/icons/EditPhotoIcon';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { updateUserProfileAtom, userProfileAtom } from '@/entities/user';
import { Colors } from '@/shared/tokens';
import { Avatar, IconButton } from '@/shared/ui';

import { useUploadAvatar } from '../model/useUploadAvatar';
import { AvatarPhotoOptionsModal } from './AvatarPhotoOptionsModal';

interface AvatarUploaderProps {
	size?: number;
	onAvatarChange?: (uri: string | null) => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
	size = 100,
	onAvatarChange,
}) => {
	const { uploadAvatar, takePhoto, isLoading, avatarUrl } = useUploadAvatar();
	const profileState = useAtomValue(userProfileAtom);
	const updateUser = useSetAtom(updateUserProfileAtom);
	const [optionsVisible, setOptionsVisible] = useState(false);
	const [anchor, setAnchor] = useState<{
		x: number;
		y: number;
		width: number;
		height: number;
	} | null>(null);

	const onAvatarLayout = (e: LayoutChangeEvent) => {
		const { x, y, width, height } = e.nativeEvent.layout;
		console.log('x, y, width, height', x, y, width, height);
		
		setAnchor({ x, y: y, width, height });
	};

	const openOptions = () => setOptionsVisible(true);
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

	return (
		<View style={styles.container}>
			<IconButton
				onPress={openOptions}
				disabled={isLoading}
				style={[styles.avatarContainer, { borderRadius: size / 2 }]}
				onLayout={onAvatarLayout}
			>
				<Avatar uri={avatarUrl} size={size} />
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
			</IconButton>
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
