// Селектор вкладок для bottom sheet

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors, Fonts } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

import type { TabType } from '../model/types';

interface TabSelectorProps {
	currentTab: TabType;
	onTabChange: (tab: TabType) => void;
	isExpanded: boolean;
}

const tabs: { key: TabType; label: string }[] = [
	{ key: 'overview', label: 'Обзор' },
	{ key: 'photos', label: 'Фото' },
	{ key: 'reviews', label: 'Отзывы' },
];

export function TabSelector({
	currentTab,
	onTabChange,
	isExpanded,
}: TabSelectorProps) {
	if (!isExpanded) {
		return null; // Tabs are only visible when expanded
	}

	return (
		<View style={styles.container}>
			{tabs.map(tab => (
				<TouchableOpacity
					key={tab.key}
					style={[
						styles.tab,
						currentTab === tab.key && styles.activeTab,
					]}
					onPress={() => onTabChange(tab.key)}
				>
					<AppText
						style={[
							styles.tabText,
							currentTab === tab.key && styles.activeTabText,
						]}
					>
						{tab.label}
					</AppText>
				</TouchableOpacity>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	activeTab: {
		borderBottomColor: Colors.greenPrimary,
		borderBottomWidth: 2,
	},
	activeTabText: {
		color: Colors.black,
		fontFamily: Fonts.semibold,
	},
	container: {
		flexDirection: 'row',
		gap: 24,
	},
	tab: {
		paddingBottom: 12,
		paddingHorizontal: 4,
	},
	tabText: {
		color: Colors.grayText,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
	},
});
