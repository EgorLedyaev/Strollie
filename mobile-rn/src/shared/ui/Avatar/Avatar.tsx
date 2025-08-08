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
				<View style={styles.iconContainer}></View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
		backgroundColor: Colors.lightBackground,
	},
	image: {
		width: '100%',
		height: '100%',
	},
	iconContainer: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Colors.grayAvatar, // Цвет фона, если аватар не загружен
	},
});
