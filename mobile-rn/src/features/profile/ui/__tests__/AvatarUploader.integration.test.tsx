import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { AvatarUploader } from '../AvatarUploader';

// 1. Mock popover to avoid portal complexity, still respect visibility
jest.mock('react-native-popover-view', () => ({
	__esModule: true,
	default: ({
		isVisible,
		children,
	}: {
		isVisible: boolean;
		children: React.ReactNode;
	}) => (isVisible ? <>{children}</> : null),
	PopoverPlacement: { BOTTOM: 'bottom' },
	Rect: function Rect(x: number, y: number, width: number, height: number) {
		return { x, y, width, height };
	},
}));

// 2. Mock jotai to eliminate async atomWithStorage suspense
jest.mock('jotai', () => {
	const actual = jest.requireActual('jotai');
	return {
		...actual,
		atom: actual.atom, // preserve atom creation for modules that import it
		useAtomValue: jest.fn(() => ({ profile: null })),
		useSetAtom: jest.fn(() => jest.fn()),
	};
});

// 3. Mock avatar upload model to remove side-effects
jest.mock('../../model/useUploadAvatar', () => ({
	useUploadAvatar: () => ({
		uploadAvatar: jest.fn(),
		takePhoto: jest.fn(),
		isLoading: false,
		avatarUrl: null,
		error: null,
	}),
}));

// 4. Mock useAnchorMeasurement to return deterministic anchor & instant measure
jest.mock('@/shared/lib', () => {
	const actual = jest.requireActual('@/shared/lib');
	return {
		...actual,
		useAnchorMeasurement: () => {
			const anchor = { x: 10, y: 20, width: 100, height: 100 };
			return {
				ref: { current: {} },
				anchor,
				measure: jest.fn(() => Promise.resolve(anchor)),
				reset: jest.fn(),
				setAnchorManually: jest.fn(),
			};
		},
	};
});

// Ensure requestAnimationFrame executes immediately
beforeAll(() => {
	(
		global as unknown as {
			requestAnimationFrame: (cb: FrameRequestCallback) => number;
		}
	).requestAnimationFrame = (cb: FrameRequestCallback) => {
		cb(0);
		return 0;
	};
});

describe('AvatarUploader popover integration', () => {
	it('opens popover after pressing avatar button', async () => {
		const { getByTestId, queryByTestId } = render(<AvatarUploader />);

		expect(queryByTestId('avatar-photo-menu')).toBeNull();

		const button = getByTestId('avatar-photo-menu-button');
		fireEvent.press(button);

		await waitFor(() =>
			expect(queryByTestId('avatar-photo-menu')).not.toBeNull(),
		);
	});
});
