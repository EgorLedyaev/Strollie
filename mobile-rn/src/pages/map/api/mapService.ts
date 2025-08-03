// mapService.ts
// import apiClient from '@/pages/MapScreen/appClient'; // TODO: Fix import

export async function loadMapHtml() {
	try {
		// Пробуем загрузить HTML с сервера
		const webviewUrl = process.env.EXPO_PUBLIC_WEBVIEW_URL;

		if (webviewUrl) {
			// Нормализация URL
			const normalizedUrl = webviewUrl.startsWith('http')
				? webviewUrl
				: `http://${webviewUrl}`;

			try {
				console.log('Загрузка HTML по URL:', normalizedUrl);
				// const { data } = await apiClient.get(normalizedUrl); // TODO: Fix apiClient

				console.log('HTML успешно загружен');
				return null; // Временно возвращаем null
			} catch (error) {
				console.warn('Не удалось загрузить HTML по сети:', error);
			}
		}
	} catch (error) {
		console.error('Ошибка загрузки HTML шаблона:', error);
		return null;
	}
}
