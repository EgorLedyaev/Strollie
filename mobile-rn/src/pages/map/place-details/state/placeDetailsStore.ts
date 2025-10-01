// Хук для управления состоянием деталей места

import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from 'react';

import type { Place, TabType } from '../types';

interface PlaceDetailsContextValue {
	selectedPlace: Place | null;
	setSelectedPlace: (place: Place | null) => void;
	currentTab: TabType;
	setCurrentTab: (tab: TabType) => void;
	isExpanded: boolean;
	setIsExpanded: (expanded: boolean) => void;
	userHasReviewed: boolean;
	setUserHasReviewed: (value: boolean) => void;
	isReviewFormVisible: boolean;
	setIsReviewFormVisible: (value: boolean) => void;
	resetState: () => void;
}

const PlaceDetailsContext = createContext<PlaceDetailsContextValue | undefined>(
	undefined,
);

interface PlaceDetailsProviderProps {
	children: ReactNode;
}

export function PlaceDetailsProvider({ children }: PlaceDetailsProviderProps) {
	const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
	const [currentTab, setCurrentTab] = useState<TabType>('overview');
	const [isExpanded, setIsExpanded] = useState(false);
	const [userHasReviewed, setUserHasReviewed] = useState(false);
	const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);

	const resetState = useCallback(() => {
		setSelectedPlace(null);
		setCurrentTab('overview');
		setIsExpanded(false);
		setUserHasReviewed(false);
		setIsReviewFormVisible(false);
	}, []);

	const value = useMemo<PlaceDetailsContextValue>(
		() => ({
			selectedPlace,
			setSelectedPlace,
			currentTab,
			setCurrentTab,
			isExpanded,
			setIsExpanded,
			userHasReviewed,
			setUserHasReviewed,
			isReviewFormVisible,
			setIsReviewFormVisible,
			resetState,
		}),
		[
			selectedPlace,
			currentTab,
			isExpanded,
			userHasReviewed,
			isReviewFormVisible,
			resetState,
		],
	);

	return React.createElement(
		PlaceDetailsContext.Provider,
		{ value },
		children,
	);
}

export function usePlaceDetails() {
	const context = useContext(PlaceDetailsContext);

	if (!context) {
		throw new Error(
			'usePlaceDetails must be used within a PlaceDetailsProvider',
		);
	}

	return context;
}
