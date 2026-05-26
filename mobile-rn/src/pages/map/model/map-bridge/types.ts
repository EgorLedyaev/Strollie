export type FollowMode = 'none' | 'center' | 'heading';

export interface UseMapBridgeOptions {
	/** Вызывается при клике на существующий маркер, передаёт сохранённые данные места */
	onMarkerClick?: (placeData: unknown) => void;
	/** Вызывается при клике по карте, должен вернуть данные места или null */
	onMapClick?: (coordinates: [number, number]) => Promise<unknown | null>;
}
