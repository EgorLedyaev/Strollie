import EditPhotoIcon from '@/assets/icons/EditPhotoIcon';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar, IconButton } from '@/shared/ui';

import { useUploadAvatar } from '../model/useUploadAvatar';

interface AvatarUploaderProps {
	size?: number;
	onAvatarChange?: (uri: string | null) => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
	size = 100,
	onAvatarChange,
}) => {
	const { uploadAvatar, isLoading, avatarUrl } = useUploadAvatar();

	const handleUpload = async () => {
		const uri = await uploadAvatar();

		if (onAvatarChange) {
			onAvatarChange(uri);
		}
	};

	return (
		<View style={styles.container}>
			<IconButton
				onPress={handleUpload}
				disabled={isLoading}
				style={styles.avatarContainer}
			>
				<Avatar uri={avatarUrl} size={size} />
				<View style={styles.iconContainer}>
					<EditPhotoIcon />
				</View>
			</IconButton>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		marginVertical: 20,
	},
	avatarContainer: {
		position: 'relative',
		borderRadius: 50,
	},
	iconContainer: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
