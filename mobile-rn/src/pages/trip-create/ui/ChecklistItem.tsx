import DeleteIcon from '@/assets/icons/DeleteIcon';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { TripChecklistItem } from '@/entities/trip';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

type ChecklistItemProps = {
	item: TripChecklistItem;
	onDelete: (id: string) => void;
};

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
	item,
	onDelete,
}) => (
	<View style={styles.checklistItem}>
		<View style={styles.checkboxWrapper}>
			<View style={styles.checkbox} />
			<AppText style={styles.checklistText}>{item.text}</AppText>
		</View>
		<Pressable onPress={() => onDelete(item.id)} hitSlop={10}>
			<View style={styles.deleteButtonIconContainer}>
				<DeleteIcon />
			</View>
		</Pressable>
	</View>
);

const styles = StyleSheet.create({
	checkbox: {
		borderColor: Colors.placeholderGray,
		borderRadius: Radius.r4,
		borderWidth: 2,
		height: 20,
		width: 20,
	},
	checkboxWrapper: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 8,
	},
	checklistItem: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 12,
		justifyContent: 'space-between',
	},
	checklistText: {
		color: Colors.headerAndInputText,
		fontSize: Fonts.f16,
	},
	deleteButtonIconContainer: {
		alignItems: 'center',
		height: 16,
		justifyContent: 'center',
		width: 16,
	},
});
