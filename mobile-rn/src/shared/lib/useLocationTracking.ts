import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';

import { updateLastKnownUser } from './map-bootstrap';

type LocationCoords = Location.LocationObjectCoords;

export function useLocationTracking(isEnabled: boolean = true) {
	const [location, setLocation] = useState<LocationCoords | null>(null);
	const [locationError, setLocationError] = useState<string | null>(null);
	const [heading, setHeading] = useState<number | null>(null);
	const [headingAvailable, setHeadingAvailable] = useState(false);

	const lastHeadingRef = useRef<number | null>(null);
	const smoothedHeadingRef = useRef<number | null>(null);

	// Low-pass filter for smooth heading transitions
	const smoothHeading = (
		newValue: number,
		oldValue: number | null,
		alpha = 0.15,
	): number => {
		if (oldValue === null) return newValue;
		// Handle wrap-around at 360°
		let diff = newValue - oldValue;
		if (diff > 180) diff -= 360;
		if (diff < -180) diff += 360;
		return (((oldValue + alpha * diff) % 360) + 360) % 360;
	};

	// Compass heading tracking
	useEffect(() => {
		if (!isEnabled) {
			setHeading(null);
			setHeadingAvailable(false);
			return;
		}

		let subscription: ReturnType<typeof Magnetometer.addListener> | null =
			null;
		let isMounted = true;

		const startCompass = async () => {
			const isAvailable = await Magnetometer.isAvailableAsync();
			if (isMounted) setHeadingAvailable(isAvailable);
			if (!isAvailable || !isMounted) return;

			Magnetometer.setUpdateInterval(100); // 10 Hz

			subscription = Magnetometer.addListener(({ x, y }) => {
				if (!isMounted) return;

				// Calculate raw heading from magnetometer
				let rawAngle = Math.atan2(y, x) * (180 / Math.PI);
				if (rawAngle < 0) rawAngle += 360;

				// Apply low-pass filter for smooth transitions
				const smoothed = smoothHeading(
					rawAngle,
					smoothedHeadingRef.current,
				);
				smoothedHeadingRef.current = smoothed;

				const rounded = Math.round(smoothed);

				// Only emit if changed by >= 1 degree (already smoothed)
				if (
					lastHeadingRef.current === null ||
					Math.abs(rounded - lastHeadingRef.current) >= 1
				) {
					lastHeadingRef.current = rounded;
					setHeading(rounded);
				}
			});
		};

		startCompass();

		return () => {
			isMounted = false;
			subscription?.remove();
		};
	}, [isEnabled]);

	// Location tracking
	useEffect(() => {
		if (!isEnabled) {
			// Если хук отключен, ничего не делаем
			setLocation(null);
			setLocationError(null);
			return;
		}

		let watchSub: Location.LocationSubscription | null = null;
		let isMounted = true; // Флаг для предотвращения обновления состояния после размонтирования

		const startTracking = async () => {
			try {
				const servicesEnabled =
					await Location.hasServicesEnabledAsync();
				if (!servicesEnabled) {
					if (isMounted)
						setLocationError('Службы геолокации выключены');
					return;
				}

				const { status } =
					await Location.requestForegroundPermissionsAsync();
				if (status !== 'granted') {
					if (isMounted)
						setLocationError(
							'Разрешение на доступ к геолокации отклонено',
						);
					return;
				}
				if (!isMounted) return; // Проверка перед асинхронным вызовом

				// Получаем начальную позицию
				try {
					const currentLocation =
						await Location.getCurrentPositionAsync({
							// accuracy: Location.Accuracy.Balanced // Можно выбрать менее точный для скорости
						});
					if (isMounted) {
						setLocation(currentLocation.coords);
						setLocationError(null); // Сбрасываем ошибку при успехе
						void updateLastKnownUser([
							currentLocation.coords.longitude,
							currentLocation.coords.latitude,
						]);
					}
				} catch (e) {
					console.error('Error getting initial location', e);
					if (isMounted)
						setLocationError(
							'Не удалось получить начальную геолокацию',
						);
				}
				if (!isMounted) return; // Проверка перед подпиской

				// Начинаем отслеживание
				watchSub = await Location.watchPositionAsync(
					{
						accuracy: Location.Accuracy.High,
						timeInterval: 5000, // 5 секунд
						distanceInterval: 10, // 10 метров
					},
					newLocation => {
						if (isMounted) {
							// console.log('Location update:', newLocation.coords); // Для отладки
							setLocation(newLocation.coords);
							setLocationError(null); // Сбрасываем ошибку при успехе
							void updateLastKnownUser([
								newLocation.coords.longitude,
								newLocation.coords.latitude,
							]);
						}
					},
				);
			} catch (error) {
				console.error('Error starting location tracking:', error);
				if (isMounted)
					setLocationError('Ошибка запуска отслеживания геолокации');
			}
		};

		startTracking();

		// Очистка при размонтировании или отключении
		return () => {
			isMounted = false;
			if (watchSub) {
				watchSub.remove();
				watchSub = null; // Обнуляем ссылку
				console.log('Location subscription removed.'); // Для отладки
			}
		};
	}, [isEnabled]); // Зависим от флага включения

	return { location, locationError, heading, headingAvailable };
}
