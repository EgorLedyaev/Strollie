// Global Jest setup: mock AsyncStorage to avoid NativeModule null errors in unit tests.
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Node 25 exposes experimental global localStorage that throws unless --localstorage-file is passed.
// Tests run without that flag, so we polyfill an in-memory implementation to keep modules happy.
const ensureLocalStorage = () => {
	let needsMock = false;

	try {
		// Accessing localStorage in Node 25 throws a SecurityError if not enabled.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		globalThis.localStorage;
	} catch {
		needsMock = true;
	}

	if (!needsMock && typeof globalThis.localStorage !== 'undefined') {
		return;
	}

	const storage = () => {
		const store = new Map<string, string>();

		return {
			get length() {
				return store.size;
			},
			clear: () => store.clear(),
			getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
			key: (index: number) => Array.from(store.keys())[index] ?? null,
			removeItem: (key: string) => {
				store.delete(key);
			},
			setItem: (key: string, value: string) => {
				store.set(key, value);
			},
		};
	};

	Object.defineProperty(globalThis, 'localStorage', {
		configurable: true,
		enumerable: true,
		value: storage(),
		writable: true,
	});
};

ensureLocalStorage();

// Provide required public env vars for modules that assert on presence at import time
process.env.EXPO_PUBLIC_2GIS_API_KEY = process.env.EXPO_PUBLIC_2GIS_API_KEY || 'TEST_2GIS_KEY';
