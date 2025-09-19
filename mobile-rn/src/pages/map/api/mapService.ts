// mapService.ts
// import apiClient from '@/pages/MapScreen/appClient'; // TODO: Fix import

import { resolveWebviewUrl } from '@/shared/lib';

export async function loadMapHtml() {
	try {
		const { url: normalizedUrl } = resolveWebviewUrl();

		try {
			console.log('Загрузка HTML по URL:', normalizedUrl);
			// const { data } = await apiClient.get(normalizedUrl); // TODO: Fix apiClient

			console.log('HTML успешно загружен');
			return null; // Временно возвращаем null
		} catch (error) {
			console.warn('Не удалось загрузить HTML по сети:', error);
		}
		// Если по каким-то причинам нет URL, просто уходим
	} catch (error) {
		console.error('Ошибка загрузки HTML шаблона:', error);
		return null;
	}
}
