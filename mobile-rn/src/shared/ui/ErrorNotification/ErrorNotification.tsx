import { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';

import { Colors, Fonts } from '@/shared/tokens';

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
		backgroundColor: Colors.red,
		padding: 15,
		position: 'absolute',
		top: 0,
		width: Dimensions.get('screen').width,
	},
	errorText: {
		color: Colors.white,
		fontFamily: Fonts.bold,
		fontSize: Fonts.f16,
		textAlign: 'center',
	},
});
