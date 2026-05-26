import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/shared/tokens';

type Props = {
	color?: string;
};

/**
 * Рисует подложку под статус-бар для edge-to-edge режимов.
 * Используйте на экранах с однотонным фоном, чтобы перекрыть прозрачный статус-бар.
 */
export const StatusBarBackground: React.FC<Props> = ({
	color = Colors.lightBackground,
}) => {
	const insets = useSafeAreaInsets();

	if (!insets.top) return null;

	return <View style={{ height: insets.top, backgroundColor: color }} />;
};
