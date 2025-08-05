import ActionIcon from '@/assets/icons/action';
import ArrowLeftIcon from '@/assets/icons/arrow-left';
import { useNavigation } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors, Fonts } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

interface HeaderProps {
	email: string;
	onMenuPress: () => void;
}

export function ProfileHeader({ email, onMenuPress }: HeaderProps) {
	const navigation = useNavigation();
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.iconButton}
					hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
				>
					<ArrowLeftIcon />
				</TouchableOpacity>
				<AppText style={styles.text}>{email}</AppText>
				<TouchableOpacity
					onPress={onMenuPress}
					style={styles.iconButton}
					hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
				>
					<ActionIcon />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		// width: '100%',
		height: 160,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: -5,
	},
	text: {
		color: Colors.darkGray,
		fontFamily: Fonts.semibold,
		fontSize: Fonts.f16,
	},
	iconButton: {
		padding: 5, // Увеличиваем область кнопки
	},
});
