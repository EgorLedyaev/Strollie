import { createContext, useContext } from 'react';

interface BottomNavBarContextType {
	setNavBarVisible: (visible: boolean) => void;
}

export const BottomNavBarContext =
	createContext<BottomNavBarContextType | null>(null);

export function useBottomNavBarControl() {
	const context = useContext(BottomNavBarContext);
	if (!context) {
		// Возвращаем no-op функцию если контекст не предоставлен
		return { setNavBarVisible: () => {} };
	}
	return context;
}
