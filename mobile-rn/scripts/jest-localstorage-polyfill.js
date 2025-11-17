const createInMemoryStorage = () => {
    const store = new Map();

    return {
        get length() {
            return store.size;
        },
        clear: () => {
            store.clear();
        },
        getItem: key => (store.has(key) ? store.get(key) : null),
        key: index => Array.from(store.keys())[index] ?? null,
        removeItem: key => {
            store.delete(key);
        },
        setItem: (key, value) => {
            store.set(String(key), String(value));
        },
    };
};

const ensureLocalStorageAvailable = () => {
    let shouldMock = false;

    try {
        // Accessing localStorage in Node 25 throws unless --localstorage-file is provided.
        // eslint-disable-next-line no-unused-expressions
        globalThis.localStorage;
    } catch {
        shouldMock = true;
    }

    if (!shouldMock && typeof globalThis.localStorage !== 'undefined') {
        return;
    }

    Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        enumerable: true,
        value: createInMemoryStorage(),
        writable: true,
    });
};

ensureLocalStorageAvailable();
