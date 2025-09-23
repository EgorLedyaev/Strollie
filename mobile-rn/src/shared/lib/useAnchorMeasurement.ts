import { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';

export interface AnchorRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface UseAnchorMeasurementOptions {
	/**
	 * Если true — при первом успешном измерении значение anchor фиксируется
	 * и больше не обновляется, пока явно не вызвать reset(). По умолчанию false.
	 */
	freezeOnceMeasured?: boolean;
}

interface UseAnchorMeasurementResult {
	ref: React.RefObject<View | null>;
	anchor: AnchorRect | null;
	measure: () => Promise<AnchorRect | null>;
	reset: () => void;
	setAnchorManually: (rect: AnchorRect | null) => void;
}

/**
 * Универсальный хук для измерения позиции элемента в координатах экрана с помощью measureInWindow.
 * Возвращает ref, текущее значение anchor и функцию measure() (Promise), которую можно вызывать
 * перед открытием поповера / меню. Не зависит от конкретной UI-библиотеки.
 */
export function useAnchorMeasurement(
	options: UseAnchorMeasurementOptions = {},
): UseAnchorMeasurementResult {
	const { freezeOnceMeasured = false } = options;
	const ref = useRef<View>(null);
	const [anchor, setAnchor] = useState<AnchorRect | null>(null);
	const frozen = useRef(false);
	// Храним последнюю измеренную геометрию синхронно для мгновенного повторного использования
	const lastRectRef = useRef<AnchorRect | null>(null);

	const measure = useCallback(() => {
		return new Promise<AnchorRect | null>(resolve => {
			if (freezeOnceMeasured && frozen.current && lastRectRef.current) {
				resolve(lastRectRef.current);
				return;
			}
			const target = ref.current;
			if (!target || !target.measureInWindow) {
				resolve(null);
				return;
			}
			target.measureInWindow((x, y, width, height) => {
				const rect = { x, y, width, height };
				lastRectRef.current = rect;
				setAnchor(rect);
				if (freezeOnceMeasured) frozen.current = true;
				resolve(rect);
			});
		});
	}, [anchor, freezeOnceMeasured]);

	const reset = useCallback(() => {
		frozen.current = false;
		lastRectRef.current = null;
		setAnchor(null);
	}, []);

	const setAnchorManually = useCallback(
		(rect: AnchorRect | null) => {
			if (freezeOnceMeasured) frozen.current = !!rect;
			lastRectRef.current = rect;
			setAnchor(rect);
		},
		[freezeOnceMeasured],
	);

	return { ref, anchor, measure, reset, setAnchorManually };
}
