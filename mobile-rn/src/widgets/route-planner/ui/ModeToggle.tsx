import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

interface ModeToggleProps {
	activeMode: 'manual' | 'ai';
	onModeChange: (mode: 'manual' | 'ai') => void;
	style?: ViewStyle;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
	activeMode,
	onModeChange,
	style,
}) => {
	return (
		<View style={[styles.toggleContainer, style]}>
			<TouchableOpacity
				style={[
					styles.toggleButton,
					activeMode === 'manual' && styles.toggleButtonActive,
				]}
				onPress={() => onModeChange('manual')}
			>
				<AppText
					style={[
						styles.toggleText,
						activeMode === 'manual' && styles.toggleTextActive,
					]}
				>
					Вручную
				</AppText>
			</TouchableOpacity>
			<TouchableOpacity
				style={[
					styles.toggleButton,
					activeMode === 'ai' && styles.toggleButtonActive,
				]}
				onPress={() => onModeChange('ai')}
			>
				<AppText
					style={[
						styles.toggleText,
						activeMode === 'ai' && styles.toggleTextActive,
					]}
				>
					Искусственный интеллект
				</AppText>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	toggleButton: {
		alignItems: 'center',
		borderRadius: Radius.r8,
		flex: 1,
		justifyContent: 'center',
	},
	toggleButtonActive: {
		backgroundColor: Colors.white,
		borderRadius: Radius.r100,
	},
	toggleContainer: {
		backgroundColor: Colors.inputBorder,
		borderRadius: Radius.r100,
		flexDirection: 'row',
		flex: 1,
		height: 46,
		// marginHorizontal: 16,
		paddingHorizontal: 7,
		paddingVertical: 4,
	},
	toggleText: {
		color: Colors.secondaryText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f14,
		textAlign: 'center',
	},
	toggleTextActive: {
		color: Colors.headerAndInputText,
	},
});
