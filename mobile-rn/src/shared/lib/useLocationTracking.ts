import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import { updateLastKnownUser } from './map-bootstrap';

type LocationCoords = Location.LocationObjectCoords;

export function useLocationTracking(isEnabled: boolean = true) {
	const [location, setLocation] = useState<LocationCoords | null>(null);
	const [locationError, setLocationError] = useState<string | null>(null);

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

	return { location, locationError };
}
