import AsyncStorage from '@react-native-async-storage/async-storage';

export type Coordinates = [number, number];

export interface PersistedLocation {
	lastKnownUser?: Coordinates;
	fallbackCity: {
		center: Coordinates;
		zoom: number;
	};
	apiKey?: string;
	userLocationZoom: number;
	shouldCenterOnUser: boolean;
}

export interface MapBootstrapPayload {
	apiKey?: string;
	cityCenter: Coordinates;
	cityZoom: number;
	userLocation?: Coordinates;
	userLocationZoom?: number;
	centerOnUser?: boolean;
	centerOnNextUserFix?: boolean;
	tokens?: {
		mapSettings?: {
			defaultCenter?: Coordinates;
			defaultZoom?: number;
			userLocationZoom?: number;
		};
	};
}

const STORAGE_KEY = '@strollie/map/persisted-location';

const DEFAULT_FALLBACK_CITY: PersistedLocation['fallbackCity'] = {
	// Саратов (lon, lat)
	center: [46.034257, 51.533557],
	zoom: 12,
};

const DEFAULT_USER_LOCATION_ZOOM = 16;

const DEFAULT_STATE: PersistedLocation = {
	fallbackCity: DEFAULT_FALLBACK_CITY,
	userLocationZoom: DEFAULT_USER_LOCATION_ZOOM,
	shouldCenterOnUser: true,
};

function mergePersisted(
	base: PersistedLocation,
	patch: Partial<PersistedLocation>,
): PersistedLocation {
	return {
		...base,
		...patch,
		fallbackCity: {
			...base.fallbackCity,
			...patch.fallbackCity,
		},
	};
}

export async function loadPersistedLocation(): Promise<PersistedLocation> {
	try {
		const raw = await AsyncStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return { ...DEFAULT_STATE };
		}

		const parsed = JSON.parse(raw) as Partial<PersistedLocation>;
		return mergePersisted(DEFAULT_STATE, parsed);
	} catch (error) {
		console.warn(
			'[map-bootstrap] Failed to load persisted location',
			error,
		);
		return { ...DEFAULT_STATE };
	}
}

async function persistState(next: PersistedLocation) {
	try {
		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	} catch (error) {
		console.warn('[map-bootstrap] Failed to persist location', error);
	}
}

export async function savePersistedLocation(
	patch: Partial<PersistedLocation>,
): Promise<PersistedLocation> {
	const current = await loadPersistedLocation();
	const next = mergePersisted(current, patch);
	await persistState(next);
	return next;
}

export async function updateLastKnownUser(
	coordinates: Coordinates | undefined,
): Promise<void> {
	if (!coordinates) {
		await savePersistedLocation({ lastKnownUser: undefined });
		return;
	}

	await savePersistedLocation({ lastKnownUser: coordinates });
}

export async function updateShouldCenterOnUser(
	shouldCenter: boolean,
): Promise<void> {
	await savePersistedLocation({ shouldCenterOnUser: shouldCenter });
}

export async function ensureApiKeyPersisted(apiKey?: string): Promise<void> {
	if (!apiKey) return;

	const current = await loadPersistedLocation();
	if (current.apiKey === apiKey) return;

	await savePersistedLocation({ apiKey });
}

export function buildBootstrapPayload(
	state: PersistedLocation,
): MapBootstrapPayload {
	const payload: MapBootstrapPayload = {
		apiKey: state.apiKey,
		cityCenter: state.fallbackCity.center,
		cityZoom: state.fallbackCity.zoom,
		userLocationZoom: state.userLocationZoom,
		centerOnUser: state.shouldCenterOnUser,
		centerOnNextUserFix: state.shouldCenterOnUser,
		tokens: {
			mapSettings: {
				defaultCenter: state.fallbackCity.center,
				defaultZoom: state.fallbackCity.zoom,
				userLocationZoom: state.userLocationZoom,
			},
		},
	};

	if (state.lastKnownUser) {
		payload.userLocation = state.lastKnownUser;
	}

	return payload;
}

function sanitizeValue(value: unknown): unknown {
	if (value === undefined || value === null) {
		return undefined;
	}

	if (Array.isArray(value)) {
		const sanitizedArray = value
			.map(item => sanitizeValue(item))
			.filter(item => item !== undefined);
		return sanitizedArray.length > 0 ? sanitizedArray : undefined;
	}

	if (typeof value === 'object') {
		const entries = Object.entries(value as Record<string, unknown>).reduce(
			(acc, [key, entryValue]) => {
				const sanitizedEntry = sanitizeValue(entryValue);
				if (sanitizedEntry !== undefined) {
					acc[key] = sanitizedEntry;
				}
				return acc;
			},
			{} as Record<string, unknown>,
		);

		return Object.keys(entries).length > 0 ? entries : undefined;
	}

	return value;
}

export function createBootstrapScript(payload: MapBootstrapPayload): string {
	const sanitized = sanitizeValue(payload) as
		| Record<string, unknown>
		| undefined;
	if (!sanitized || Object.keys(sanitized).length === 0) {
		return '';
	}

	return `window.__STROLLIE_MAP_BOOTSTRAP__ = ${JSON.stringify(sanitized)};`;
}
