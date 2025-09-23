import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors, Fonts, Gaps } from '@/shared/tokens';
import { AppText } from '@/shared/ui';

export interface EmptyStateProps {
	image: React.ReactNode;
	title: string;
	description: string;
	action?: React.ReactNode;
	testId?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
	image,
	title,
	description,
	action,
	testId,
}) => {
	return (
		<View style={styles.content} testID={testId}>
			<View style={styles.imageContainer}>{image}</View>
			<AppText style={styles.title} variant='header'>
				{title}
			</AppText>
			<AppText style={styles.subtitle} variant='body'>
				{description}
			</AppText>
			{action && <View style={styles.actionContainer}>{action}</View>}
		</View>
	);
};

const styles = StyleSheet.create({
	actionContainer: {
		alignItems: 'center',
		marginTop: Gaps.g48,
		width: '100%',
	},
	content: {
		alignItems: 'center',
		width: '100%',
		// flex: 1,
		// justifyContent: 'center',
		// justifyContent: 'flex-start',
		// paddingHorizontal: Gaps.g24,
		// paddingTop: 80,
	},
	imageContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: Gaps.g20,
		minHeight: 265,
	},
	subtitle: {
		color: Colors.secondaryText,
		// marginBottom: Gaps.g48,
		textAlign: 'center',
		width: 320,
	},
	title: {
		color: Colors.headerAndInputText,
		fontSize: Fonts.f20,
		marginBottom: Gaps.g10,
		textAlign: 'center',
		width: 250,
	},
});
