import AddTicketIcon from '@/assets/icons/tickets/AddTicketIcon';
import tickets_empty from '@/assets/images/tickets-empty.png';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Gaps, Radius } from '@/shared/tokens';
import { AppButton, AppText } from '@/shared/ui';

export const EmptyTicketsPage: React.FC = () => {
	const onAddTicket = () => {
		console.log("'Добавить билет' pressed");
	};

	return (
		<View style={styles.content}>
			<View>
				<Image source={tickets_empty} style={styles.image} />
				<Image
					source={tickets_empty}
					style={[styles.image, styles.imageRotated]}
				/>
			</View>

			<AppText style={styles.title} variant='header'>
				Билетов пока нет
			</AppText>
			<AppText style={styles.subtitle} variant='body'>
				Здесь можно хранить свои билеты на различные мероприятия или
				рейсы
			</AppText>

			<AppButton
				onPress={onAddTicket}
				buttonBorderRadius={Radius.r16}
				textFontSize={Fonts.f16}
				textFontFamily={Fonts.medium}
				style={styles.addButton}
			>
				<View style={styles.addButtonContent}>
					<AddTicketIcon />
					<AppText variant='button' style={styles.addButtonText} >Добавить билет</AppText>
				</View>
			</AppButton>
		</View>
	);
};

const styles = StyleSheet.create({
	addButton: {
		height: 52,
		width: '100%',
	},
	addButtonContent: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: Gaps.g8,
	},
	addButtonText: {
		fontFamily: Fonts.medium,
		fontSize: Fonts.f16,
	},
	content: {
		alignItems: 'center',
		flex: 1,
		marginTop: Gaps.g80,
	},
	image: {
		alignSelf: 'center',
		height: 193,
		justifyContent: 'center',
		marginBottom: Gaps.g20,
		resizeMode: 'contain',
		width: 237,
	},
	imageRotated: {
		position: 'absolute',
		transform: [{ rotate: '15deg' }],
	},
	subtitle: {
		color: Colors.secondaryText,
		marginBottom: Gaps.g48,
		textAlign: 'center',
	},
	title: {
		fontSize: Fonts.f20,
		marginBottom: Gaps.g16,
	},
});
