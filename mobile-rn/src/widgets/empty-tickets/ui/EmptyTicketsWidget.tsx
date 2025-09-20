import AddTicketIcon from '@/assets/icons/tickets/AddTicketIcon';
import tickets_empty_events from '@/assets/images/tickets/tickets-empty-events.png';
import tickets_empty from '@/assets/images/tickets/tickets-empty.png';
import { Image, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppButton, AppText } from '@/shared/ui';

type Variant = 'transport' | 'events';

export interface EmptyTicketsWidgetProps {
	title: string;
	subtitle: string;
	variant: Variant;
	onAddPress?: () => void;
	testId?: string;
}

export const EmptyTicketsWidget: React.FC<EmptyTicketsWidgetProps> = ({
	title,
	subtitle,
	variant,
	onAddPress,
	testId,
}) => {
	return (
		<View style={styles.content} testID={testId}>
			{variant == 'transport' ? (
				<View>
					<Image
						source={tickets_empty}
						style={[styles.image, styles.imageRotated]}
					/>
					<Image source={tickets_empty} style={styles.image} />
				</View>
			) : (
				<Image source={tickets_empty_events} style={styles.image} />
			)}

			<AppText style={styles.title} variant='header'>
				{title}
			</AppText>
			<AppText style={styles.subtitle} variant='body'>
				{subtitle}
			</AppText>

			<AppButton
				onPress={onAddPress}
				buttonBorderRadius={Radius.r16}
				textFontSize={Fonts.f16}
				textFontFamily={Fonts.medium}
				style={styles.addButton}
			>
				<View style={styles.addButtonContent}>
					<AddTicketIcon />
					<AppText variant='button' style={styles.addButtonText}>
						Добавить билет
					</AppText>
				</View>
			</AppButton>
		</View>
	);
};

const styles = StyleSheet.create({
	addButton: { height: 52, width: '100%' },
	addButtonContent: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: Gaps.g8,
	},
	addButtonText: { fontFamily: Fonts.medium, fontSize: Fonts.f16 },
	content: { alignItems: 'center', flex: 1, marginTop: Gaps.g80 },
	image: {
		alignSelf: 'center',
		height: 265,
		justifyContent: 'center',
		marginBottom: Gaps.g20,
		resizeMode: 'contain',
		width: 265,
	},
	imageRotated: { position: 'absolute', transform: [{ rotate: '-15deg' }] },
	subtitle: {
		color: Colors.secondaryText,
		marginBottom: Gaps.g48,
		textAlign: 'center',
	},
	title: {
		color: Colors.headerAndInputText,
		fontSize: Fonts.f20,
		marginBottom: Gaps.g16,
	},
});
