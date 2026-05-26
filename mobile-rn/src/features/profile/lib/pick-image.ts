import * as ImagePicker from 'expo-image-picker';

/**
 * [LIB] Изолированная функция для выбора изображения из галереи.
 * Она не знает ничего о состоянии приложения, загрузке или ошибках.
 * Ее единственная задача - вернуть URI выбранного изображения или null.
 */
export const pickImage = async (): Promise<string | null> => {
	const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
	if (status !== 'granted') {
		// Мы не устанавливаем состояние ошибки здесь, мы просто сообщаем о неудаче.
		// Вызывающий код решит, что делать с этой информацией.
		console.error('Разрешение на доступ к медиатеке не предоставлено');
		return null;
	}

	try {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.7,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			return result.assets[0].uri;
		}

		return null;
	} catch (err) {
		console.error('Ошибка при выборе изображения:', err);
		return null;
	}
};
