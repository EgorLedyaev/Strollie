import * as ImagePicker from 'expo-image-picker';

/**
 * [LIB] Захват фото с камеры. Возвращает uri или null если отменено / нет разрешений.
 */
export const takePhoto = async (): Promise<string | null> => {
	const { status } = await ImagePicker.requestCameraPermissionsAsync();
	if (status !== 'granted') {
		console.error('Разрешение на использование камеры не предоставлено');
		return null;
	}

	try {
		const result = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.7,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			return result.assets[0].uri;
		}
		return null;
	} catch (err) {
		console.error('Ошибка при съемке фото:', err);
		return null;
	}
};
