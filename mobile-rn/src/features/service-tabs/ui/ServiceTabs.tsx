import { Colors, Fonts, Radius } from '@/src/shared/tokens';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ServiceTab {
	id: string;
	title: string;
	icon?: React.ReactNode;
}

interface ServiceTabsProps {
	tabs: ServiceTab[];
	onSelect: (id: string) => void;
}

export const ServiceTabs: React.FC<ServiceTabsProps> = ({ tabs, onSelect }) => {
	return (
		<View style={styles.container}>
			<View style={styles.tabsRow}>
				{tabs.map(tab => (
					<View key={tab.id} style={styles.tabContainer}>
						<TouchableOpacity
							style={styles.tab}
							onPress={() => onSelect(tab.id)}
						>
							{tab.icon}
						</TouchableOpacity>
						<Text style={styles.tabTitle}>{tab.title}</Text>
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		padding: 15,
	},
	tabsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	tabContainer: {
		alignItems: 'center',
		width: 80,
	},
	tab: {
		width: 80,
		height: 50,
		borderRadius: Radius.r15,
		backgroundColor: Colors.lightBackground,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 6,
	},
	tabTitle: {
		fontFamily: Fonts.regular,
		fontSize: 12,
		color: Colors.grayIcon,
	},
});
