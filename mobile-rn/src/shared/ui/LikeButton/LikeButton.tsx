import LikeIcon from '@/assets/icons/LikeIcon';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Colors, Radius } from '@/shared/tokens';

interface Props {
	onPress: () => void;
	liked: boolean;
}
export const LikeButton: React.FC<Props> = ({ onPress, liked }) => {
	return (
		<Pressable onPress={onPress} style={styles.likeButton}>
			<LikeIcon color={liked ? Colors.likeActive : Colors.likeInactive} />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	likeButton: {
		alignItems: 'center',
		backgroundColor: Colors.grayBackground,
		borderRadius: Radius.r12,
		height: 32,
		justifyContent: 'center',
		margin: 19,
		position: 'absolute',
		width: 32,
	},
});
