import * as Location from 'expo-location';
import { useSetAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { Linking, Platform } from 'react-native';

import {
	generatedRouteAtom,
	useGenerateRouteMutation,
	type Coordinates,
	type Place,
	type RouteGenerationResponse,
} from '@/entities/generated-route';
import { useLocationTracking } from '@/shared/lib';

import { useCategoriesQuery } from '../api/useCategories';

const CATEGORY_ORDER: string[] = [
	'Парки',
	'Музеи',
	'Кофейни',
	'Рестораны',
	'Бары',
	'Развлечения',
	'Достопримечательности',
	'Прогулка',
];

interface UseRoutePlannerParams {
	isVisible: boolean;
}

export interface UseRoutePlannerResult {
	// data
	startPointText: string;
	startPointError: string | null;
	locationError: string | null;
	orderedCategories: { id: string; label: string }[];
	selectedCategories: string[];
	hours: string;
	minutes: string;
	comment: string;
	routeResult: RouteGenerationResponse | null;
	canOpenDirections: boolean;
	hiddenPlaceIds: Set<string>;
	// flags
	isCategoriesLoading: boolean;
	isGenerating: boolean;
	isGeocoding: boolean;
	isOpeningExternal: boolean;
	// handlers
	handleStartPointChange: (value: string) => void;
	handleClearStartPoint: () => void;
	setHours: (value: string) => void;
	setMinutes: (value: string) => void;
	setComment: (value: string) => void;
	resetResult: () => void;
	applyMyLocation: () => void;
	geocodeOnBlur: () => Promise<void>;
	toggleCategory: (category: string) => void;
	handleHidePlace: (id: string) => void;
	handleSubmit: () => Promise<void>;
	handleOpenDirections: () => Promise<void>;
}

export const useRoutePlanner = ({
	isVisible,
}: UseRoutePlannerParams): UseRoutePlannerResult => {
	const { data: categoriesData, isPending: isCategoriesLoading } =
		useCategoriesQuery();
	const { mutateAsync: generateRoute, isPending: isGenerating } =
		useGenerateRouteMutation();
	const { location, locationError } = useLocationTracking(isVisible);

	const [startPointText, setStartPointText] = useState('');
	const [startPointCoords, setStartPointCoords] =
		useState<Coordinates | null>(null);
	const [isStartManuallyEdited, setIsStartManuallyEdited] = useState(false);
	const [startPointError, setStartPointError] = useState<string | null>(null);
	const [isGeocoding, setIsGeocoding] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [hours, setHours] = useState('');
	const [minutes, setMinutes] = useState('');
	const [comment, setComment] = useState('');
	const [routeResult, setRouteResult] =
		useState<RouteGenerationResponse | null>(null);
	const setGeneratedRoute = useSetAtom(generatedRouteAtom);
	const [isOpeningExternal, setIsOpeningExternal] = useState(false);
	const [hiddenPlaceIds, setHiddenPlaceIds] = useState<Set<string>>(
		new Set(),
	);

	const buildYandexWebUrl = (
		start: Coordinates | null,
		places: Place[],
	): string | null => {
		if (!places.length) return null;
		const points: string[] = [];
		if (start) {
			points.push(`${start.lat},${start.lon}`);
		}
		points.push(...places.map(p => `${p.lat},${p.lon}`));
		return `https://yandex.ru/maps/?rtext=${points.join('~')}&rtt=pd`;
	};

	const buildPreferredDirectionsUrls = (
		start: Coordinates | null,
		places: Place[],
	): string[] => {
		if (!places.length) return [];
		const waypointList = [
			...(start ? [`${start.lat},${start.lon}`] : []),
			...places.map(p => `${p.lat},${p.lon}`),
		];
		const yandexScheme = `yandexmaps://maps.yandex.ru/?rtext=${waypointList.join('~')}&rtt=pd`;
		const googleScheme = `googlemaps://?daddr=${places
			.map(p => `${p.lat},${p.lon}`)
			.join('+')}&directionsmode=walking`;
		const appleScheme = `maps://?daddr=${places
			.map(p => `${p.lat},${p.lon}`)
			.join(' to:')}&dirflg=w`;
		const twoGisScheme = places.length
			? `dgis://2gis.ru/routeSearch/rsType/pedestrian/from/${start?.lon ?? ''},${start?.lat ?? ''}/to/${places[0].lon},${places[0].lat}`
			: '';
		const webYandex = buildYandexWebUrl(start, places);

		if (Platform.OS === 'ios') {
			return [yandexScheme, appleScheme, googleScheme, webYandex].filter(
				Boolean,
			) as string[];
		}

		return [yandexScheme, twoGisScheme, googleScheme, webYandex].filter(
			Boolean,
		) as string[];
	};

	useEffect(() => {
		if (location && !isStartManuallyEdited) {
			setStartPointCoords({
				lat: location.latitude,
				lon: location.longitude,
			});
			setStartPointText('Моё местоположение');
			setStartPointError(null);
		}
	}, [location, isStartManuallyEdited]);

	const orderedCategories = useMemo(() => {
		if (!categoriesData) return [] as { id: string; label: string }[];

		const map = new Map(
			categoriesData.map(item => [item.category, item.id]),
		);
		const prioritized = CATEGORY_ORDER.filter(name => map.has(name)).map(
			label => ({ label, id: map.get(label)! }),
		);
		const remaining = categoriesData
			.filter(item => !CATEGORY_ORDER.includes(item.category))
			.map(item => ({ id: item.id, label: item.category }));
		return [...prioritized, ...remaining].slice(0, 8);
	}, [categoriesData]);

	const applyMyLocation = () => {
		if (!location) {
			setStartPointError(
				locationError || 'Геолокация недоступна, попробуйте позже',
			);
			return;
		}

		setStartPointCoords({
			lat: location.latitude,
			lon: location.longitude,
		});
		setStartPointText('Моё местоположение');
		setStartPointError(null);
		setIsStartManuallyEdited(false);
		resetResult();
	};

	const geocodeStartPoint = async () => {
		const trimmedStart = startPointText.trim();
		if (!trimmedStart) {
			setStartPointCoords(null);
			setStartPointError('Укажите стартовую точку');
			return null;
		}

		setIsGeocoding(true);
		try {
			const [geocoded] = await Location.geocodeAsync(trimmedStart);
			if (geocoded) {
				const coords = {
					lat: geocoded.latitude,
					lon: geocoded.longitude,
				};
				setStartPointCoords(coords);
				setStartPointError(null);
				return coords;
			}
			setStartPointCoords(null);
			setStartPointError('Не удалось распознать стартовую точку');
			return null;
		} catch (error) {
			console.warn('Failed to geocode start point', error);
			setStartPointCoords(null);
			setStartPointError('Не удалось определить координаты старта');
			return null;
		} finally {
			setIsGeocoding(false);
		}
	};

	const geocodeOnBlur = async () => {
		if (isStartManuallyEdited) {
			await geocodeStartPoint();
		}
	};

	const resolveCity = async (coords: Coordinates): Promise<string> => {
		try {
			const result = await Location.reverseGeocodeAsync({
				latitude: coords.lat,
				longitude: coords.lon,
			});
			const record = result[0];
			return (
				record?.city || record?.region || record?.subregion || 'Саратов'
			);
		} catch (error) {
			console.warn('Failed to reverse geocode city', error);
			return 'Саратов';
		}
	};

	const toggleCategory = (category: string) => {
		setSelectedCategories(prev =>
			prev.includes(category)
				? prev.filter(item => item !== category)
				: [...prev, category],
		);
	};

	const resetResult = () => {
		setRouteResult(null);
		setGeneratedRoute(null);
		setHiddenPlaceIds(new Set());
	};

	const handleStartPointChange = (value: string) => {
		setStartPointText(value);
		setIsStartManuallyEdited(true);
		setStartPointCoords(null);
		setStartPointError(null);
	};

	const handleClearStartPoint = () => {
		setStartPointText('');
		setStartPointCoords(null);
		setIsStartManuallyEdited(false);
		resetResult();
	};

	const handleHidePlace = (id: string) => {
		setHiddenPlaceIds(prev => new Set([...prev, id]));
		setRouteResult(prev => {
			if (!prev) return prev;
			const nextPlaces = prev.places.filter(place => place.id !== id);
			const nextUrl = buildYandexWebUrl(startPointCoords, nextPlaces);
			return {
				...prev,
				places: nextPlaces,
				directionsUrl: nextUrl || prev.directionsUrl,
			};
		});
	};

	const handleOpenDirections = async () => {
		const currentPlaces = routeResult?.places ?? [];
		if (!currentPlaces.length) return;

		const preferred = buildPreferredDirectionsUrls(
			startPointCoords,
			currentPlaces,
		);
		const fallbackWeb = buildYandexWebUrl(startPointCoords, currentPlaces);
		const candidates = [
			routeResult?.directionsUrl,
			...preferred,
			fallbackWeb,
		]
			.filter((url): url is string => Boolean(url))
			.filter((url, idx, arr) => arr.indexOf(url) === idx);

		console.warn('Directions candidates', candidates);

		try {
			setIsOpeningExternal(true);
			for (const url of candidates) {
				try {
					const supported = await Linking.canOpenURL(url);
					console.warn('Directions try', { url, supported });
					if (supported) {
						await Linking.openURL(url);
						return;
					}
				} catch (err) {
					console.warn('URL open attempt failed', url, err);
				}
			}
			if (fallbackWeb) {
				console.warn('No native support, opening web', fallbackWeb);
				await Linking.openURL(fallbackWeb);
				return;
			}
			console.warn('No available maps app to open directions');
		} finally {
			setIsOpeningExternal(false);
		}
	};

	const handleSubmit = async () => {
		setStartPointError(null);
		setRouteResult(null);
		setGeneratedRoute(null);

		let coords = startPointCoords;

		if (isStartManuallyEdited) {
			coords = await geocodeStartPoint();
		}

		if (!coords) {
			setStartPointError(
				locationError ||
					'Укажите стартовую точку, выберите на карте или включите геолокацию',
			);
			return;
		}

		const parsedHours = Number.parseInt(hours || '0', 10);
		const parsedMinutes = Number.parseInt(minutes || '0', 10);
		const totalMinutes = parsedHours * 60 + parsedMinutes;
		const durationHours = Math.max(1, Math.round(totalMinutes / 60) || 1);

		const description = comment.trim() || 'Маршрут без комментариев';
		const city = await resolveCity(coords);

		try {
			const payload = {
				city,
				categories:
					selectedCategories.length > 0
						? selectedCategories
						: undefined,
				description,
				durationHours,
				startPoint: coords,
			};
			const response = await generateRoute(payload);
			const fallbackUrl = buildYandexWebUrl(coords, response.places);
			setRouteResult({
				...response,
				directionsUrl: response.directionsUrl || fallbackUrl || '',
			});
			setGeneratedRoute(response);
		} catch (error) {
			console.warn('Failed to generate route', error);
		}
	};

	const canOpenDirections = Boolean(routeResult?.places?.length);

	return {
		startPointText,
		startPointError,
		locationError,
		orderedCategories,
		selectedCategories,
		hours,
		minutes,
		comment,
		routeResult,
		canOpenDirections,
		hiddenPlaceIds,
		isCategoriesLoading,
		isGenerating,
		isGeocoding,
		isOpeningExternal,
		handleStartPointChange,
		handleClearStartPoint,
		setHours,
		setMinutes,
		setComment,
		resetResult,
		applyMyLocation,
		geocodeOnBlur,
		toggleCategory,
		handleHidePlace,
		handleSubmit,
		handleOpenDirections,
	};
};
