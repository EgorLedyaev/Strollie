import { act, render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';

import { useAnchorMeasurement } from '../useAnchorMeasurement';

// Mock measureInWindow by injecting a test component that calls measure manually.

interface TestGlobals {
	__test_measure?: () => Promise<{
		x: number;
		y: number;
		width: number;
		height: number;
	} | null>;
	__test_reset?: () => void;
	__test_setAltMeasure?: (
		impl: () => { x: number; y: number; width: number; height: number },
	) => void;
}

declare const global: typeof globalThis & TestGlobals;

function TestComponent({ freeze = false }: { freeze?: boolean }) {
	const { ref, anchor, measure, reset } = useAnchorMeasurement({
		freezeOnceMeasured: freeze,
	});

	// локально храним текущую функцию, чтобы можно было подменять измерение
	let customMeasureImpl:
		| (() => { x: number; y: number; width: number; height: number })
		| null = null;

	type MeasureCapable = {
		measureInWindow?: (
			cb: (x: number, y: number, w: number, h: number) => void,
		) => void;
	} & View;

	const attachRef = (node: View | null) => {
		if (node) {
			(node as unknown as MeasureCapable).measureInWindow = (
				cb: (x: number, y: number, w: number, h: number) => void,
			) => {
				const base = customMeasureImpl
					? customMeasureImpl()
					: { x: 10, y: 20, width: 30, height: 40 };
				cb(base.x, base.y, base.width, base.height);
			};
		}
		// assign to hook ref
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		ref.current = node;
	};

	// Экспортируем утилиты в глобал только для тестов
	global.__test_measure = measure;
	global.__test_reset = reset;
	global.__test_setAltMeasure = impl => {
		customMeasureImpl = impl;
	};

	return (
		<View>
			<View ref={attachRef} testID='anchor-view' />
			<View
				testID='debug'
				accessibilityLabel={
					anchor
						? `${anchor.x},${anchor.y},${anchor.width},${anchor.height}`
						: 'none'
				}
			/>
		</View>
	);
}

describe('useAnchorMeasurement', () => {
	it('measures and sets anchor', async () => {
		render(<TestComponent />);
		await act(async () => {
			const rect = await global.__test_measure!();
			expect(rect).toEqual({ x: 10, y: 20, width: 30, height: 40 });
		});
	});

	it('freezeOnceMeasured prevents re-measure after first call', async () => {
		render(<TestComponent freeze />);
		await act(async () => {
			const first = await global.__test_measure!();
			expect(first).toEqual({ x: 10, y: 20, width: 30, height: 40 });
			global.__test_setAltMeasure?.(() => ({
				x: 99,
				y: 99,
				width: 99,
				height: 99,
			}));
			const second = await global.__test_measure!();
			expect(second).toEqual(first); // не поменялось из-за freeze
		});
	});

	it('reset clears freeze and allows new measure', async () => {
		render(<TestComponent freeze />);
		await act(async () => {
			const first = await global.__test_measure!();
			expect(first).toEqual({ x: 10, y: 20, width: 30, height: 40 });
			global.__test_reset?.();
			global.__test_setAltMeasure?.(() => ({
				x: 5,
				y: 6,
				width: 70,
				height: 80,
			}));
			const second = await global.__test_measure!();
			expect(second).toEqual({ x: 5, y: 6, width: 70, height: 80 });
		});
	});
});
