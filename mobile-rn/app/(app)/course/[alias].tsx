import { Colors } from '@/src/shared/tokens';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function CoursePage() {
	const { alias } = useLocalSearchParams();
	return (
		<>
			<View>
				<Text style={styles.text}>{alias}</Text>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	text: {
		color: Colors.white,
	},
});
