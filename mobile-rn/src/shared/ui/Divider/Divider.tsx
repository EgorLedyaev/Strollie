import { Colors } from "@/shared/tokens";
import { View, StyleSheet } from "react-native";
import { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";

interface DividerProps {
	style?: ViewProps['style'];
}

export const Divider = ({ style }: DividerProps) => {
	return <View style={[styles.divider, style]} />;
};

const styles = StyleSheet.create({
	divider: {
		backgroundColor: Colors.divider,
		height: 1,
	},
});