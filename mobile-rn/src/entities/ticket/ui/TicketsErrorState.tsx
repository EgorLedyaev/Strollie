import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors, Fonts, Gaps } from '@/shared/tokens';
import { AppButton, AppText } from '@/shared/ui';

interface Props {
	message?: string;
	onRetry?: () => void;
	testId?: string;
}

export const TicketsErrorState: React.FC<Props> = ({
	message = 'Упс! Что-то пошло не так. Попробуйте снова.',
	onRetry,
	testId,
}) => {
	return (
		<View style={styles.root} testID={testId || 'tickets-error'}>
			<AppText style={styles.text}>{message}</AppText>
			{onRetry ? (
				<AppButton
					variant='outline'
					text='Повторить'
					onPress={onRetry}
				/>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	root: { alignItems: 'center', gap: Gaps.g16, justifyContent: 'center' },
	text: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
		textAlign: 'center',
	},
});

export default TicketsErrorState;
