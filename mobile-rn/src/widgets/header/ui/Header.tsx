import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Fonts, Sizes } from '@/shared/tokens';
import { AppText, BackButton } from '@/shared/ui';

export interface HeaderProps {
	title: string;
	onBackPress?: () => void;
	rightContent?: React.ReactNode;
	testId?: string;
}

export const Header: React.FC<HeaderProps> = ({
	title,
	onBackPress,
	rightContent,
	testId,
}) => {
	const router = useRouter();
	const handleBackPress = onBackPress || (() => router.back());

	return (
		<View style={styles.header} testID={testId}>
			<BackButton variant='icon' onPress={handleBackPress} />
			<AppText style={styles.headerTitle}>{title}</AppText>
			{rightContent ? (
				rightContent
			) : (
				<View style={styles.headerRightStub} />
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 16,
	},
	headerRightStub: {
		height: Sizes.button.sm,
		width: Sizes.button.sm,
	},
	headerTitle: {
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
	},
});
