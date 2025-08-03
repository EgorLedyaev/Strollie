import EditPhotoIcon from '@/assets/icons/EditPhotoIcon';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/shared/tokens';
import { Avatar } from '@/shared/ui';

import { useUploadAvatar } from '../model';

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
			<TouchableOpacity
				onPress={handleUpload}
				disabled={isLoading}
				style={styles.avatarContainer}
			>
				<Avatar uri={avatarUrl} size={size} />
				<View style={styles.iconContainer}>
					<EditPhotoIcon />
				</View>
			</TouchableOpacity>
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
	},
	iconContainer: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		backgroundColor: Colors.white,
		borderRadius: 12,
		padding: 6,
		shadowColor: Colors.black,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
});
