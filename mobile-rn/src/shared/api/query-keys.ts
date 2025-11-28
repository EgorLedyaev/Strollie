const sessionRoot = ['session'] as const;
const citiesRoot = ['cities'] as const;
const routesRoot = ['routes'] as const;
const placesRoot = ['places'] as const;
const ticketsRoot = ['tickets'] as const;
const tripsRoot = ['trips'] as const;

export const sessionKeys = {
	all: sessionRoot,
	profile: () => [...sessionRoot, 'profile'] as const,
};

export const citiesKeys = {
	all: citiesRoot,
};

export const routesKeys = {
	all: routesRoot,
	byId: (id: string) => [...routesRoot, id] as const,
};

export const ticketsKeys = {
	all: ticketsRoot,
	byId: (id: string) => [...ticketsRoot, id] as const,
};

export const tripsKeys = {
	all: tripsRoot,
	byId: (id: string) => [...tripsRoot, id] as const,
};

export const placesKeys = {
	suggest: (query: string, limit: number) =>
		[...placesRoot, 'suggest', query, limit] as const,
	details: (id: string) => [...placesRoot, 'details', id] as const,
	geocode: (
		query: string,
		location: [number, number] | undefined,
		results: number,
	) =>
		[
			...placesRoot,
			'geocode',
			query,
			location ? `${location[0]},${location[1]}` : 'none',
			results,
		] as const,
};

export const queryKeys = {
	session: sessionKeys,
	cities: citiesKeys,
	routes: routesKeys,
	places: placesKeys,
	tickets: ticketsKeys,
	trips: tripsKeys,
} as const;

type ValueOf<T> = T[keyof T];
type ExtractKeys<T> = T extends (...args: never) => infer R ? R : T;

export type QueryKey = ExtractKeys<ValueOf<typeof queryKeys>>;
