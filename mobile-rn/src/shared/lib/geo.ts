const EARTH_RADIUS_METERS = 6371000;

function toRadians(value: number): number {
	return (value * Math.PI) / 180;
}

export function calculateDistanceMeters(
	a: { lat: number; lon: number },
	b: { lat: number; lon: number },
): number {
	const lat1 = toRadians(a.lat);
	const lon1 = toRadians(a.lon);
	const lat2 = toRadians(b.lat);
	const lon2 = toRadians(b.lon);

	const deltaLat = lat2 - lat1;
	const deltaLon = lon2 - lon1;

	const sinLat = Math.sin(deltaLat / 2);
	const sinLon = Math.sin(deltaLon / 2);

	const haversine =
		sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;

	const centralAngle =
		2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

	return EARTH_RADIUS_METERS * centralAngle;
}

export function formatDistance(distanceMeters: number): string {
	if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
		return '';
	}

	if (distanceMeters >= 1000) {
		const kilometers = distanceMeters / 1000;
		return `${kilometers.toFixed(1).replace('.', ',')} км`;
	}

	const rounded = Math.round(distanceMeters / 10) * 10;
	return `${rounded} м`;
}
