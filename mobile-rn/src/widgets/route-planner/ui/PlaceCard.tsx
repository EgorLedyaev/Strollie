import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
	ImageBackground,
	ImageSourcePropType,
	Pressable,
	StyleSheet,
	View,
} from 'react-native';

import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText, LikeButton } from '@/shared/ui';

type PlaceCardProps = {
	title: string;
	type: string;
	address: string;
	isFavourite: boolean;
	image?: ImageSourcePropType;
};

export const PlaceCard: React.FC<PlaceCardProps> = ({
	title,
	type,
	address,
	isFavourite,
	image,
}) => {
	const [liked, setLiked] = useState(isFavourite);
	return (
		<Pressable style={styles.card}>
			<ImageBackground
				source={image}
				style={styles.cardImage}
				imageStyle={{ borderRadius: Radius.r16 }}
			>
				<LinearGradient
					colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
					style={styles.gradient}
				/>
				<View style={styles.heartButton}>
					<LikeButton
						onPress={() => setLiked(!liked)}
						liked={liked}
						variant={'small'}
					/>
				</View>
				<View style={styles.cardTextContainer}>
					<AppText style={styles.cardTitle}>{title}</AppText>
					<AppText style={styles.cardTitle}>{type}</AppText>
					<AppText style={styles.cardAddress}>{address}</AppText>
				</View>
			</ImageBackground>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		borderRadius: Radius.r16,
		height: 120,
		overflow: 'hidden',
	},
	cardAddress: {
		color: Colors.white,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f14,
	},
	cardImage: {
		backgroundColor: Colors.lightInputText,
		flex: 1,
	},
	cardTextContainer: {
		left: 20,
		position: 'absolute',
		top: 30,
	},
	cardTitle: {
		color: Colors.white,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
		paddingBottom: 5,
	},
	gradient: {
		...StyleSheet.absoluteFillObject,
	},
	heartButton: {
		position: 'absolute',
		right: 16,
		top: 16,
	},
});
