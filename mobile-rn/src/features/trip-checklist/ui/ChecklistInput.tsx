import CheckmarkIconMedium from '@/assets/icons/CheckmarkIconMedium';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppTextInput } from '@/shared/ui';

export const ChecklistInput: React.FC<{ onAdd: (text: string) => void }> = ({
	onAdd,
}) => {
	const [text, setText] = useState('');

	const handleAdd = () => {
		if (text.trim()) {
			onAdd(text.trim());
			setText('');
		}
	};

	return (
		<View style={styles.checklistInputContainer}>
			<AppTextInput
				value={text}
				onChangeText={setText}
				placeholder='Что нужно сделать?'
				style={styles.checklistInput}
				placeholderTextColor={Colors.grayMedium}
				onSubmitEditing={handleAdd}
			/>
			<Pressable onPress={handleAdd} style={styles.confirmButton}>
				{/*<View style={styles.confirmIcon} />*/}
				<CheckmarkIconMedium />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	checklistInput: {
		flex: 1,
		fontSize: Fonts.f14,
		height: 40,
		marginHorizontal: 16,
	},
	checklistInputContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 12,
		paddingRight: 16,
	},

	confirmButton: {
		alignItems: 'center',
		backgroundColor: Colors.placeholderGray,
		borderRadius: Radius.r4,
		height: 20,
		justifyContent: 'center',
		width: 20,
	},
});
