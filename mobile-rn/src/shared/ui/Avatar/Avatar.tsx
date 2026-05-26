import NoPhotoIcon from '@/assets/icons/NoPhotoIcon';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Colors } from '../../tokens';

interface AvatarProps {
	uri?: string | null;
	size?: number;
	style?: object;
}

export const Avatar = ({ uri, size = 100, style }: AvatarProps) => {
	const containerStyle = {
		width: size,
		height: size,
		borderRadius: size / 2,
	};

	return (
		<View style={[styles.container, containerStyle, style]}>
			{uri ? (
				<Image
					source={{ uri }}
					style={[styles.image, containerStyle]}
					resizeMode='cover'
				/>
			) : (
				<View style={styles.iconContainer}>
					<NoPhotoIcon />
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
	},
	iconContainer: {
		alignItems: 'center',
		...StyleSheet.absoluteFillObject,
		backgroundColor: Colors.noPhotoIconBackground, // Цвет фона, если аватар не загружен
		justifyContent: 'center',
	},
	image: {
		height: '100%',
		width: '100%',
	},
});
