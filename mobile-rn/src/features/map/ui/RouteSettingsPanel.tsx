// src/features/map/ui/RouteSettingsPanel.tsx
import { Colors, Fonts, Gaps, Radius } from '@/src/shared/tokens';
import React, { useEffect, useState } from 'react';
import {
	Platform,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

// Slider убираем, так как были проблемы с установкой

export interface RoutePreferences {
	preferParks: boolean;
	avoidHills: boolean;
	walkingSpeed: number; // км/ч
	desiredDistance: number; // км
}

interface RouteSettingsPanelProps {
	initialPreferences: RoutePreferences;
	onPreferencesChange: (newPreferences: RoutePreferences) => void;
	onClose: () => void; // Добавляем колбэк для закрытия
	isVisible: boolean;
	actualRouteDistance: number | null; // Текущая длина построенного маршрута
}

export const RouteSettingsPanel: React.FC<RouteSettingsPanelProps> = ({
	initialPreferences,
	onPreferencesChange,
	onClose,
	isVisible,
	actualRouteDistance,
}) => {
	const [preferences, setPreferences] =
		useState<RoutePreferences>(initialPreferences);

	// Синхронизируем внутреннее состояние с initialPreferences, если они меняются извне
	useEffect(() => {
		setPreferences(initialPreferences);
	}, [initialPreferences]);

	const handleValueChange = (
		key: keyof RoutePreferences,
		value: boolean | number,
	) => {
		const newPrefs = { ...preferences, [key]: value };
		setPreferences(newPrefs);
		onPreferencesChange(newPrefs); // Отправляем изменения сразу
	};

	const incrementSpeed = () => {
		const newSpeed = parseFloat(
			(preferences.walkingSpeed + 0.1).toFixed(1),
		);
		if (newSpeed <= 7.0) {
			// Максимум 7 км/ч
			handleValueChange('walkingSpeed', newSpeed);
		}
	};

	const decrementSpeed = () => {
		const newSpeed = parseFloat(
			(preferences.walkingSpeed - 0.1).toFixed(1),
		);
		if (newSpeed >= 3.0) {
			// Минимум 3 км/ч
			handleValueChange('walkingSpeed', newSpeed);
		}
	};

	const incrementDistance = () => {
		const newDistance = parseFloat(
			(preferences.desiredDistance + 0.5).toFixed(1),
		);
		// Ограничим максимальное желаемое расстояние, например, 50 км
		if (newDistance <= 50.0) {
			handleValueChange('desiredDistance', newDistance);
		}
	};

	const decrementDistance = () => {
		const newDistance = parseFloat(
			(preferences.desiredDistance - 0.5).toFixed(1),
		);
		// Нельзя сделать желаемое расстояние меньше, чем минимально возможный оптимальный маршрут
		// или какое-то разумное минимальное значение (например, 0.5 км)
		const minAllowed =
			actualRouteDistance !== null && actualRouteDistance > 0.5
				? actualRouteDistance
				: 0.5;
		if (newDistance >= minAllowed) {
			handleValueChange('desiredDistance', newDistance);
		} else if (preferences.desiredDistance > minAllowed) {
			// Если текущее больше, но декремент делает меньше
			handleValueChange('desiredDistance', minAllowed);
		}
	};

	if (!isVisible) {
		return null;
	}

	return (
		<View style={styles.panelContainer}>
			<View style={styles.headerRow}>
				<Text style={styles.panelTitle}>Настройки маршрута</Text>
				<TouchableOpacity onPress={onClose} style={styles.closeButton}>
					<Text style={styles.closeButtonText}>✕</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.settingRow}>
				<Text style={styles.settingText}>Предпочитать парки</Text>
				<Switch
					trackColor={{
						false: Colors.gray,
						true: Colors.greenSecondary,
					}}
					thumbColor={
						preferences.preferParks
							? Colors.greenPrimary
							: Colors.lightGray
					}
					ios_backgroundColor={Colors.gray}
					onValueChange={value =>
						handleValueChange('preferParks', value)
					}
					value={preferences.preferParks}
				/>
			</View>

			<View style={styles.settingRow}>
				<Text style={styles.settingText}>Избегать холмов</Text>
				<Switch
					trackColor={{
						false: Colors.gray,
						true: Colors.greenSecondary,
					}}
					thumbColor={
						preferences.avoidHills
							? Colors.greenPrimary
							: Colors.lightGray
					}
					onValueChange={value =>
						handleValueChange('avoidHills', value)
					}
					value={preferences.avoidHills}
				/>
			</View>

			<Text style={styles.settingLabel}>Скорость ходьбы:</Text>
			<View style={styles.valueAdjustRow}>
				<TouchableOpacity
					style={styles.adjustButton}
					onPress={decrementSpeed}
				>
					<Text style={styles.adjustButtonText}>-</Text>
				</TouchableOpacity>
				<Text style={styles.valueText}>
					{preferences.walkingSpeed.toFixed(1)} км/ч
				</Text>
				<TouchableOpacity
					style={styles.adjustButton}
					onPress={incrementSpeed}
				>
					<Text style={styles.adjustButtonText}>+</Text>
				</TouchableOpacity>
			</View>

			<Text style={styles.settingLabel}>Желаемое расстояние:</Text>
			<View style={styles.valueAdjustRow}>
				<TouchableOpacity
					style={styles.adjustButton}
					onPress={decrementDistance}
				>
					<Text style={styles.adjustButtonText}>-</Text>
				</TouchableOpacity>
				<Text style={styles.valueText}>
					{preferences.desiredDistance.toFixed(1)} км
				</Text>
				<TouchableOpacity
					style={styles.adjustButton}
					onPress={incrementDistance}
				>
					<Text style={styles.adjustButtonText}>+</Text>
				</TouchableOpacity>
			</View>
			{actualRouteDistance !== null && (
				<Text style={styles.infoText}>
					Длина текущего маршрута: {actualRouteDistance.toFixed(1)} км
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	panelContainer: {
		position: 'absolute',
		bottom: Platform.OS === 'ios' ? 120 : 100, // Немного выше из-за кнопки Маршрут
		left: 10,
		right: 10,
		backgroundColor: Colors.white,
		borderRadius: Radius.r20,
		padding: Gaps.g20,
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
		gap: Gaps.g8,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: Gaps.g8,
	},
	panelTitle: {
		fontSize: Fonts.f18,
		fontFamily: Fonts.semibold,
		color: Colors.black,
		flex: 1, // Чтобы заголовок занимал доступное место и центрировался
		textAlign: 'center',
	},
	closeButton: {
		padding: 8, // Увеличим область нажатия
	},
	closeButtonText: {
		fontSize: Fonts.f20,
		fontFamily: Fonts.semibold,
		color: Colors.darkGray,
	},
	settingRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	settingText: {
		fontSize: Fonts.f16,
		fontFamily: Fonts.regular,
		color: Colors.black,
		flexShrink: 1, // Позволит тексту переноситься, если он длинный
	},
	settingLabel: {
		fontSize: Fonts.f16,
		fontFamily: Fonts.regular,
		color: Colors.black,
		marginBottom: Gaps.g8 / 2,
	},
	valueAdjustRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: Colors.lightBackground,
		borderRadius: Radius.r10,
		paddingHorizontal: Gaps.g8,
	},
	adjustButton: {
		paddingHorizontal: Gaps.g16,
		paddingVertical: Gaps.g8,
	},
	adjustButtonText: {
		fontSize: Fonts.f20,
		fontFamily: Fonts.semibold,
		color: Colors.greenPrimary,
	},
	valueText: {
		fontSize: Fonts.f16,
		fontFamily: Fonts.semibold,
		color: Colors.black,
		flex: 1,
		textAlign: 'center',
	},
	infoText: {
		fontSize: Fonts.f14,
		fontFamily: Fonts.regular,
		color: Colors.darkGray,
		textAlign: 'center',
		marginTop: Gaps.g8,
	},
});
