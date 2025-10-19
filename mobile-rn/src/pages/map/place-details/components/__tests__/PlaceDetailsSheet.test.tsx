import * as bottomSheetModule from '@gorhom/bottom-sheet';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
	PlaceDetailsProvider,
	usePlaceDetails,
} from '../../state/placeDetailsStore';
import type { Place, TabType } from '../../types';
import { PlaceDetailsSheet } from '../PlaceDetailsSheet';

type BottomSheetModalProps = {
	children: React.ReactNode;
	handleComponent?: () => React.ReactNode;
	footerComponent?: (props: Record<string, unknown>) => React.ReactNode;
	onChange?: (index: number) => void;
};

jest.mock('@gorhom/bottom-sheet', () => {
	const ReactActual = jest.requireActual<typeof import('react')>('react');
	const { View } =
		jest.requireActual<typeof import('react-native')>('react-native');

	const mockState = {
		present: jest.fn(),
		dismiss: jest.fn(),
		snapToIndex: jest.fn(),
		onChange: undefined as undefined | ((mockIndex: number) => void),
		lastContentContainerStyle: undefined as
			| Record<string, unknown>
			| undefined,
		lastScrollStyle: undefined as Record<string, unknown> | undefined,
	};

	const BottomSheetModal = ReactActual.forwardRef<
		unknown,
		BottomSheetModalProps
	>((props, ref) => {
		const { children, handleComponent, footerComponent } = props;
		ReactActual.useImperativeHandle(ref, () => ({
			present: mockState.present,
			dismiss: mockState.dismiss,
			snapToIndex: mockState.snapToIndex,
		}));
		mockState.onChange = props.onChange;
		return (
			<View testID='bottom-sheet-modal'>
				{handleComponent ? handleComponent() : null}
				<View testID='bottom-sheet-content'>{children}</View>
				{footerComponent
					? footerComponent({
							animatedIndex: { value: 0 },
							animatedPosition: { value: 0 },
						})
					: null}
			</View>
		);
	});

	BottomSheetModal.displayName = 'BottomSheetModal';

	const BottomSheetScrollView = ({
		children,
		contentContainerStyle,
		style,
	}: {
		children: React.ReactNode;
		contentContainerStyle?: Record<string, unknown>;
		style?: Record<string, unknown>;
	}) => {
		mockState.lastContentContainerStyle = contentContainerStyle;
		mockState.lastScrollStyle = style;
		return (
			<View testID='bottom-sheet-scroll-view' style={style}>
				<View
					testID='bottom-sheet-scroll-view-content'
					style={contentContainerStyle}
				>
					{children}
				</View>
			</View>
		);
	};

	const BottomSheetFooter = ({ children }: { children: React.ReactNode }) => (
		<View testID='bottom-sheet-footer'>{children}</View>
	);

	return {
		__esModule: true,
		BottomSheetModal,
		BottomSheetScrollView,
		BottomSheetFooter,
		__mock: mockState,
	};
});

type BottomSheetMock = {
	present: jest.Mock;
	dismiss: jest.Mock;
	snapToIndex: jest.Mock;
	onChange?: (index: number) => void;
	lastContentContainerStyle?: Record<string, unknown>;
	lastScrollStyle?: Record<string, unknown>;
};

const getBottomSheetMock = (): BottomSheetMock =>
	(bottomSheetModule as unknown as { __mock: BottomSheetMock }).__mock;

type Controls = {
	setSelectedPlace: (place: Place | null) => void;
	setIsExpanded: (value: boolean) => void;
	setCurrentTab: (tab: TabType) => void;
	setIsReviewFormVisible: (value: boolean) => void;
};

const initialMetrics = {
	frame: { x: 0, y: 0, width: 360, height: 640 },
	insets: { top: 0, right: 0, bottom: 0, left: 0 },
};

const basePlace: Place = {
	id: 'place-1',
	name: 'Парк Горького',
	type: 'Парк',
	address: {
		name: 'Москва',
		full_name: 'г. Москва, ул. Крымский Вал, 9',
	},
	point: { lat: 55.7299, lon: 37.6036 },
	description: 'Описание места',
	review_stats: {
		average_rating: 4.6,
		total_count: 123,
		rating_distribution: {
			5: 70,
			4: 30,
			3: 15,
			2: 6,
			1: 2,
		},
	},
	photos: [
		{
			id: 'photo-1',
			url: 'https://example.com/photo.jpg',
		},
	],
	reviews: [],
};

let controls: Controls | null = null;
let snapshot: { isExpanded: boolean; currentTab: TabType } = {
	isExpanded: false,
	currentTab: 'overview',
};

function getSnapshot() {
	return snapshot;
}

function StateBridge() {
	const {
		setSelectedPlace,
		setIsExpanded,
		setCurrentTab,
		setIsReviewFormVisible,
		isExpanded,
		currentTab,
	} = usePlaceDetails();

	useEffect(() => {
		controls = {
			setSelectedPlace,
			setIsExpanded,
			setCurrentTab,
			setIsReviewFormVisible,
		};
	}, [
		setSelectedPlace,
		setIsExpanded,
		setCurrentTab,
		setIsReviewFormVisible,
	]);

	useEffect(() => {
		snapshot = {
			isExpanded,
			currentTab,
		};
	}, [isExpanded, currentTab]);

	return null;
}

type RenderSheetOptions = {
	metrics?: typeof initialMetrics;
	sheetProps?: Partial<React.ComponentProps<typeof PlaceDetailsSheet>>;
};

function renderSheet({ metrics, sheetProps }: RenderSheetOptions = {}) {
	controls = null;
	snapshot = { isExpanded: false, currentTab: 'overview' };
	return render(
		<SafeAreaProvider initialMetrics={metrics ?? initialMetrics}>
			<PlaceDetailsProvider>
				<PlaceDetailsSheet {...sheetProps} />
				<StateBridge />
			</PlaceDetailsProvider>
		</SafeAreaProvider>,
	);
}

describe('PlaceDetailsSheet', () => {
	beforeEach(() => {
		const bottomSheetMock = getBottomSheetMock();
		bottomSheetMock.present.mockClear();
		bottomSheetMock.dismiss.mockClear();
		bottomSheetMock.snapToIndex.mockClear();
		bottomSheetMock.onChange = undefined;
		bottomSheetMock.lastContentContainerStyle = undefined;
		bottomSheetMock.lastScrollStyle = undefined;
		controls = null;
		snapshot = { isExpanded: false, currentTab: 'overview' };
	});

	it('presents when place is selected and dismisses when cleared', async () => {
		const bottomSheetMock = getBottomSheetMock();

		const screen = renderSheet();
		await waitFor(() => expect(controls).not.toBeNull());
		const storeControls = controls as Controls;

		// initial effect dismisses sheet when no place is selected
		expect(bottomSheetMock.dismiss).toHaveBeenCalledTimes(1);

		act(() => {
			storeControls.setSelectedPlace(basePlace);
		});

		expect(bottomSheetMock.present).toHaveBeenCalledTimes(1);

		act(() => {
			storeControls.setSelectedPlace(null);
		});

		expect(bottomSheetMock.dismiss).toHaveBeenCalledTimes(2);
		screen.unmount();
	});

	it('renders collapsed content without expanded sections', async () => {
		const screen = renderSheet();
		await waitFor(() => expect(controls).not.toBeNull());
		const storeControls = controls as Controls;

		act(() => {
			storeControls.setSelectedPlace(basePlace);
		});

		await screen.findByText(basePlace.name);

		expect(screen.queryByText('Обзор')).toBeNull();
		// collapsed header still shows place name
		expect(screen.getByText(basePlace.name)).toBeTruthy();
	});

	it('renders expanded content with tabs and summary', async () => {
		const screen = renderSheet();
		await waitFor(() => expect(controls).not.toBeNull());
		const storeControls = controls as Controls;

		act(() => {
			storeControls.setSelectedPlace(basePlace);
		});

		await screen.findByText(basePlace.name);

		const bottomSheetMock = getBottomSheetMock();
		await act(async () => {
			bottomSheetMock.onChange?.(1);
		});

		act(() => {
			storeControls.setIsExpanded(true);
		});

		await screen.findByText('Обзор');
		expect(screen.getByText('Описание')).toBeTruthy();
	});

	it('updates expansion state via onChange and triggers onDismiss', async () => {
		const onDismiss = jest.fn();
		const screen = renderSheet({ sheetProps: { onDismiss } });
		await waitFor(() => expect(controls).not.toBeNull());
		const storeControls = controls as Controls;

		act(() => {
			storeControls.setSelectedPlace(basePlace);
		});

		await screen.findByText(basePlace.name);
		const bottomSheetMock = getBottomSheetMock();

		await act(async () => {
			bottomSheetMock.onChange?.(1);
		});
		await waitFor(() => expect(getSnapshot().isExpanded).toBe(true));

		await act(async () => {
			bottomSheetMock.onChange?.(0);
		});
		await waitFor(() => expect(getSnapshot().isExpanded).toBe(false));

		await act(async () => {
			bottomSheetMock.onChange?.(-1);
		});
		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	it('opens photos tab from summary and snaps sheet to expanded state', async () => {
		const screen = renderSheet();
		await waitFor(() => expect(controls).not.toBeNull());
		const storeControls = controls as Controls;

		act(() => {
			storeControls.setSelectedPlace(basePlace);
		});

		await screen.findByText(basePlace.name);
		const bottomSheetMock = getBottomSheetMock();
		await act(async () => {
			bottomSheetMock.onChange?.(1);
		});
		await waitFor(() => expect(getSnapshot().isExpanded).toBe(true));

		await screen.findByText('Обзор');
		fireEvent.press(screen.getByText('Смотреть фото'));

		expect(bottomSheetMock.snapToIndex).toHaveBeenCalledWith(1);
		await screen.findByText('Фото');
		expect(getSnapshot().currentTab).toBe('photos');
	});

	it('switches to reviews tab when pressed', async () => {
		const screen = renderSheet();
		await waitFor(() => expect(controls).not.toBeNull());
		const storeControls = controls as Controls;

		act(() => {
			storeControls.setSelectedPlace(basePlace);
		});

		await screen.findByText(basePlace.name);
		const bottomSheetMock = getBottomSheetMock();
		await act(async () => {
			bottomSheetMock.onChange?.(1);
		});

		await screen.findByText('Обзор');
		fireEvent.press(screen.getByText('Отзывы'));

		await screen.findByText('Вы здесь были? Оцените это место!');
		expect(getSnapshot().currentTab).toBe('reviews');
	});

	it('applies safe area padding to footer and scroll content', async () => {
		const SAFE_BOTTOM = 24;
		const screen = renderSheet({
			metrics: {
				...initialMetrics,
				insets: { ...initialMetrics.insets, bottom: SAFE_BOTTOM },
			},
		});

		await waitFor(() => expect(controls).not.toBeNull());
		const storeControls = controls as Controls;

		act(() => {
			storeControls.setSelectedPlace(basePlace);
		});

		await screen.findByTestId('place-actions-wrapper');

		const footerWrapper = screen.getByTestId('place-actions-wrapper');
		const flattenedFooterStyle = StyleSheet.flatten(
			footerWrapper.props.style,
		);
		expect(flattenedFooterStyle?.paddingBottom).toBe(SAFE_BOTTOM + 12);

		const bottomSheetMock = getBottomSheetMock();
		expect(bottomSheetMock.lastContentContainerStyle).toBeDefined();
		const flattenedContentStyle = StyleSheet.flatten(
			bottomSheetMock.lastContentContainerStyle,
		) as { paddingBottom?: number };
		expect(flattenedContentStyle?.paddingBottom).toBe(
			88 + SAFE_BOTTOM + 12,
		);

		const screenDefault = renderSheet();
		await waitFor(() => expect(controls).not.toBeNull());
		const defaultControls = controls as Controls;
		act(() => {
			defaultControls.setSelectedPlace(basePlace);
		});
		await screenDefault.findByTestId('place-actions-wrapper');
		const defaultFooter = screenDefault.getByTestId(
			'place-actions-wrapper',
		);
		const flattenedDefaultFooterStyle = StyleSheet.flatten(
			defaultFooter.props.style,
		);
		expect(flattenedDefaultFooterStyle?.paddingBottom).toBe(16);
		const defaultMock = getBottomSheetMock();
		const flattenedDefaultContentStyle = StyleSheet.flatten(
			defaultMock.lastContentContainerStyle,
		) as { paddingBottom?: number };
		expect(flattenedDefaultContentStyle?.paddingBottom).toBe(88 + 16);
	});
});
