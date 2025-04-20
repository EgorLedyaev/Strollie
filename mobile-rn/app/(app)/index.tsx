import MapScreen from '@/src/pages/MapScreen/MapScreen';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function MapPage() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View style={styles.fullContainer} pointerEvents='box-none'>
				<MapScreen />
			</View>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	fullContainer: {
		flex: 1,
	},
});
