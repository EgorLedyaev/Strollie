import ActionIcon from '@/assets/icons/action';
import BackIcon from '@/assets/icons/back';
import { Colors, Fonts } from '@/src/shared/tokens';
import { useNavigation } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export function Header({ email }: { email: string }) {
	const navigation = useNavigation();
	return (
		<View style={styles.header}>
			<BackIcon onPress={() => navigation.goBack()} />
			<Text style={styles.text}>{email}</Text>
			<ActionIcon />
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
});
