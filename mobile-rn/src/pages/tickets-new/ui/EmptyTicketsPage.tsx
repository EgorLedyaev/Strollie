import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Gaps, Radius, Sizes } from '@/shared/tokens';
import { AppButton, AppText, BackButton } from '@/shared/ui';

export const EmptyTicketsPage: React.FC = () => {
	const router = useRouter();
	const onAddTicket = () => {
		console.log("'Добавить билет' pressed");
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<BackButton variant='icon' onPress={() => router.back()} />
				<AppText style={styles.headerTitle}>Мои билеты</AppText>
				<View
					style={{ width: Sizes.button.sm, height: Sizes.button.sm }}
				/>
			</View>
			<View style={styles.content}>
				<Image
					source={require('@/assets/images/tickets-empty.png')}
					style={styles.image}
				/>
				<AppText style={styles.title}>Билетов пока нет</AppText>
				<AppText style={styles.subtitle}>
					Здесь можно хранить свои билеты на различные мероприятия или
					рейсы
				</AppText>

				<AppButton
					text='Добавить билет'
					onPress={onAddTicket}
					buttonBorderRadius={Radius.r16}
					textFontSize={Fonts.f16}
					textFontFamily={Fonts.medium}
					style={styles.addButton}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	addButton: {
		height: 52,
		width: '100%',
	},
	container: {
		backgroundColor: Colors.grayBackground,
		flex: 1,
		padding: 16,
	},
	content: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		padding: 30,
	},

	header: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	headerTitle: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
		textAlign: 'center',
	},
	image: {
		alignSelf: 'center',
		height: 193,
		justifyContent: 'center',
		marginBottom: Gaps.g20,
		resizeMode: 'contain',
		width: 237,
	},
	subtitle: {
		color: Colors.textGray,
		fontFamily: Fonts.regular,
		fontSize: Fonts.f16,
		marginBottom: Gaps.g50,
		textAlign: 'center',
	},
	title: {
		color: Colors.headerAndInputText,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f20,
		marginBottom: Gaps.g16,
	},
});
