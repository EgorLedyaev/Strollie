import CheckmarkIconSmall from '@/assets/icons/CheckmarkIconSmall';
import DeleteIcon from '@/assets/icons/DeleteIcon';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { TripChecklistItem } from '@/entities/trip';
import { Colors, Fonts, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

type ChecklistItemProps = {
	item: TripChecklistItem;
	onDelete?: (id: string) => void;
	onToggle?: (id: string) => void;
	showDelete?: boolean;
};

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
	item,
	onDelete,
	onToggle,
	showDelete = false,
}) => {
	const isDone = item.done;
	const isToggleable = !!onToggle;

	return (
		<View style={styles.checklistItem}>
			<Pressable
				style={styles.checkboxWrapper}
				onPress={isToggleable ? () => onToggle(item.id) : undefined}
				disabled={!isToggleable}
			>
				<View
					style={[styles.checkbox, isDone && styles.checkboxChecked]}
				>
					{isDone && <CheckmarkIconSmall color={Colors.white} />}
				</View>
				<AppText
					style={[
						styles.checklistText,
						isDone && styles.checklistTextDone,
					]}
				>
					{item.text}
				</AppText>
			</Pressable>
			{showDelete && onDelete && (
				<Pressable onPress={() => onDelete(item.id)} hitSlop={10}>
					<View style={styles.deleteButtonIconContainer}>
						<DeleteIcon />
					</View>
				</Pressable>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	checkbox: {
		alignItems: 'center',
		borderColor: Colors.placeholderGray,
		borderRadius: Radius.r4,
		borderWidth: 2,
		height: 20,
		justifyContent: 'center',
		width: 20,
	},
	checkboxChecked: {
		backgroundColor: Colors.grayAvatar,
		borderColor: Colors.grayAvatar,
	},
	checkboxWrapper: {
		alignItems: 'center',
		flex: 1,
		flexDirection: 'row',
		gap: 8,
	},
	checklistItem: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 4,
	},
	checklistText: {
		color: Colors.headerAndInputText,
		flex: 1,
		fontSize: Fonts.f14,
	},
	checklistTextDone: {
		color: Colors.secondaryText,
	},
	deleteButtonIconContainer: {
		alignItems: 'center',
		height: 16,
		justifyContent: 'center',
		width: 16,
	},
});
