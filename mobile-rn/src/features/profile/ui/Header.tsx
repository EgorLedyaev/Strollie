import ActionIcon from '@/assets/icons/action';
import ArrowLeftIcon from '@/assets/icons/arrow-left';
import { Colors, Fonts } from '@/src/shared/tokens';
import { useNavigation } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
	email: string;
	onMenuPress: () => void;
}

export function Header({ email, onMenuPress }: HeaderProps) {
	const navigation = useNavigation();
	return (
		<View style={styles.header}>
			<TouchableOpacity
				onPress={() => navigation.goBack()}
				style={styles.iconButton}
				hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
			>
				<ArrowLeftIcon />
			</TouchableOpacity>
			<Text style={styles.text}>{email}</Text>
			<TouchableOpacity
				onPress={onMenuPress}
				style={styles.iconButton}
				hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
			>
				<ActionIcon />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
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
