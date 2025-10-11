// TODO: Сделать проверку, что дата окончания не раньше даты начала и поездка не в прошлом
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Fonts, Radius } from '@/shared/tokens';
import { AppText } from '@/shared/ui';
import { AddButton } from '@/shared/ui/AddButton';

export const SectionItem = ({
	label,
	ref,
	onPress,
}: {
	label: string;
	ref?: React.ComponentProps<typeof Link>['href'];
	onPress?: () => void;
}) => (
	<View style={styles.sectionItem}>
		<AppText variant={'header'} style={styles.sectionItemTitle}>
			{label}
		</AppText>
		{ref ? (
			<Link href={ref} asChild>
				<AddButton />
			</Link>
		) : (
			<AddButton onPress={onPress} />
		)}
	</View>
);

const styles = StyleSheet.create({
	sectionItem: {
		alignItems: 'center',
		borderRadius: Radius.r16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: 16,
		paddingTop: 24,
	},
	sectionItemTitle: {
		fontSize: Fonts.f16,
	},
});
