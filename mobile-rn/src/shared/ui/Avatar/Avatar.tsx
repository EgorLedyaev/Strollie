import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

// Используем статический импорт вместо require
import defaultAvatar from '../../../../assets/images/avatar.png';
import { Colors } from '../../tokens';

interface AvatarProps {
	uri?: string;
	size?: number;
	style?: object;
}

export const Avatar = ({ uri, size = 80, style }: AvatarProps) => {
	return (
		<View
			style={[
				styles.container,
				{ width: size, height: size, borderRadius: size / 2 },
				style,
			]}
		>
			<Image
				source={uri ? { uri } : defaultAvatar}
				style={[
					styles.image,
					{ width: size, height: size, borderRadius: size / 2 },
				]}
				resizeMode='cover'
			/>
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
});
