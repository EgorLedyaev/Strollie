// Global Jest setup: mock AsyncStorage to avoid NativeModule null errors in unit tests.
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Provide required public env vars for modules that assert on presence at import time
process.env.EXPO_PUBLIC_2GIS_API_KEY = process.env.EXPO_PUBLIC_2GIS_API_KEY || 'TEST_2GIS_KEY';
