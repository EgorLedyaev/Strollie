import ArrowLeftIcon from '@/assets/icons/arrow-left';
import { router } from 'expo-router';
import {
	StyleSheet,
	TouchableOpacity,
	TouchableOpacityProps,
} from 'react-native';

import { Colors } from '@/src/shared/tokens';
import { AppText } from '../Text';

interface BackButtonProps extends TouchableOpacityProps {
	text?: string;
	onPress?: () => void;
}

export const BackButton = ({
	text = 'Вернуться',
	onPress = () => router.back(),
	style,
	...props
}: BackButtonProps) => {
	return (
		<TouchableOpacity
			style={[styles.backButton, style]}
			onPress={onPress}
			{...props}
		>
			<ArrowLeftIcon
				style={styles.backButtonIcon}
				stroke={Colors.linkGreen}
			/>
			<AppText style={styles.backLinkText}>{text}</AppText>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
		width: 101,
		height: 20,
	},
	backButtonIcon: {
		marginRight: 5,
		width: 19,
	},
	backLinkText: {
		fontSize: 16,
		color: Colors.linkGreen,
	},
});
