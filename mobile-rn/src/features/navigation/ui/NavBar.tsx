import { Colors, Radius } from '@/src/shared/tokens';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface NavBarProps {
	leftComponent?: React.ReactNode;
	rightComponent?: React.ReactNode;
	centerComponent?: React.ReactNode;
	onPressLeft?: () => void;
	onPressCenter?: () => void;
	onPressRight?: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({
	leftComponent,
	centerComponent,
	rightComponent,
	onPressLeft,
	onPressCenter,
	onPressRight,
}) => {
	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.sideButton}
				onPress={onPressLeft}
				disabled={!onPressLeft}
			>
				{leftComponent}
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.centerButton}
				onPress={onPressCenter}
				disabled={!onPressCenter}
			>
				{centerComponent}
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.sideButton}
				onPress={onPressRight}
				disabled={!onPressRight}
			>
				{rightComponent}
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: 15,
		marginTop: 10,
	},
	sideButton: {
		width: 40,
		height: 40,
		borderRadius: Radius.r15,
		backgroundColor: Colors.lightBackground,
		justifyContent: 'center',
		alignItems: 'center',
	},
	centerButton: {
		width: 68,
		height: 68,
		borderRadius: 34,
		backgroundColor: Colors.greenPrimary,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
