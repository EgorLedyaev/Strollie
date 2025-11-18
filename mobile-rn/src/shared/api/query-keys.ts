const sessionRoot = ['session'] as const;
const citiesRoot = ['cities'] as const;
const routesRoot = ['routes'] as const;

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

export const queryKeys = {
	session: sessionKeys,
	cities: citiesKeys,
	routes: routesKeys,
} as const;

type ValueOf<T> = T[keyof T];
type ExtractKeys<T> = T extends (...args: never) => infer R ? R : T;

export type QueryKey = ExtractKeys<ValueOf<typeof queryKeys>>;
