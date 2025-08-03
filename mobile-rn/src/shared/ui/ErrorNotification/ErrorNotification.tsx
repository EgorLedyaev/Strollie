import { Colors, Fonts } from '@/shared/tokens';
import { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';

import { AppText } from '../Text';
import { ErrorNotificationProps } from './types';

export const ErrorNotification = ({ error }: ErrorNotificationProps) => {
	const [isShown, setIsShown] = useState<boolean>(false);
	const animatedValue = new Animated.Value(-100);
	const onEnter = () => {
		Animated.timing(animatedValue, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};
	useEffect(() => {
		if (!error) {
			return;
		}
		setIsShown(true);
		const timeout = setTimeout(() => {
			setIsShown(false);
		}, 3000);
		return () => {
			clearTimeout(timeout);
		};
	}, [error]);
	if (!isShown) {
		return <></>;
	}
	return (
		<>
			<Animated.View
				style={{
					...styles.error,
					transform: [{ translateY: animatedValue }],
				}}
				onLayout={onEnter}
			>
				<AppText style={styles.errorText}>{error}</AppText>
			</Animated.View>
		</>
	);
};
const styles = StyleSheet.create({
	error: {
		position: 'absolute',
		top: 0,
		padding: 15,
		width: Dimensions.get('screen').width,
		backgroundColor: Colors.red,
	},
	errorText: {
		color: Colors.white,
		fontSize: Fonts.f16,
		textAlign: 'center',
		fontFamily: 'FiraSans',
	},
});
