import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { MOCK_CDN_BASE, MOCK_UPLOAD_AVATAR_MODE, USE_MOCK_UPLOAD_AVATAR } from '@/shared/config';

/**
 * [API] Функция для загрузки аватара на сервер.
 * Принимает URI изображения и возвращает ПОСТОЯННЫЙ URL загруженного файла.
 * @param imageUri - Локальный URI изображения для загрузки.
 */
export const uploadAvatarApi = async (
	imageUri: string,
): Promise<string | null> => {
	console.log(`[API MOCK] Начинается загрузка файла: ${imageUri}`);

	// Если включен мок — эмулируем загрузку
	if (USE_MOCK_UPLOAD_AVATAR) {
		await new Promise(resolve => setTimeout(resolve, 800));

		if (!imageUri) return null;

		if (MOCK_UPLOAD_AVATAR_MODE === 'local') {
			// Возвращаем локальный URI, чтобы сразу видеть фото в UI
			console.log('[API MOCK] Возвращаем локальный URI для предпросмотра');
			return imageUri;
		}

		// Иначе вернем псевдо-CDN URL (файл реально не существует)
		const serverUrl = `${MOCK_CDN_BASE}/${uuidv4()}.jpg`;
		console.log(
			`[API MOCK] Файл успешно "загружен". Сервер вернул URL: ${serverUrl}`,
		);
		return serverUrl;
	}

	//
	// ЗДЕСЬ БУДЕТ РЕАЛЬНЫЙ КОД ЗАГРУЗКИ С FormData:
	// const formData = new FormData();
	// const filename = imageUri.split('/').pop();
	// const match = /(\.(\w+))$/.exec(filename!);
	// const type = match ? `image/${match[2]}` : `image`;
	// formData.append('avatar', { uri: imageUri, name: filename, type } as any);
	// const { data } = await apiClient.post('/users/upload-avatar', formData, {
	//   headers: { 'Content-Type': 'multipart/form-data' },
	// });
	// return data.url; // Сервер должен вернуть URL

	// В реал режиме пока ничего не делаем
	return null;
};