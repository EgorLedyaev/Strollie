import { useRouter, useSegments } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { sessionAtom } from '@/src/entities/session';

export function SessionProvider({ children }: { children: React.ReactNode }) {
	const session = useAtomValue(sessionAtom);
	const segments = useSegments(); // ['(app)', 'profile'] или ['sign-in']
	const router = useRouter();

	useEffect(() => {
		// Это определяет, находится ли текущий маршрут ВНУТРИ защищенной группы (app)
		const inAppGroup = segments[0] === '(app)';

		// Ждем, пока сессия гидрируется из AsyncStorage.
		if (session.refreshToken === undefined) {
			return; // Еще ничего не делаем, сессия грузится.
		}

		// СЦЕНАРИЙ 1: Пользователь авторизован, но находится ВНЕ приложения.
		// Например, его как-то занесло на /sign-in после входа.
		if (session.isAuthenticated && !inAppGroup) {
			console.log(
				'SessionProvider: Пользователь авторизован, но не в (app). Перенаправление в /app.',
			);
			// ВЕРНУТЬ ЕГО В ПРИЛОЖЕНИЕ.
			router.replace('/(app)');
		}
		// СЦЕНАРИЙ 2: Пользователь НЕ авторизован, но пытается залезть В ПРИЛОЖЕНИЕ.
		else if (!session.isAuthenticated && inAppGroup) {
			console.log(
				'SessionProvider: Пользователь не авторизован, но в (app). Перенаправление на /sign-in.',
            );
            // ПЕРЕНАПРАВИТЬ НА СТРАНИЦУ ВХОДА.
			router.replace('/sign-in');
		}
	}, [session.isAuthenticated, session.refreshToken, segments, router]);

	// Пока логика выше работает, мы просто рендерим детей.
	// Это либо Stack.Screen из app/_layout, либо индикатор загрузки из Suspense.
	return <>{children}</>;
}
