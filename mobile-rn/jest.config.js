/* eslint-disable no-undef */
/**
 * Dedicated Jest config moved out of package.json to fix regex alias mapping
 */
module.exports = {
    preset: 'jest-expo',
    setupFiles: ['<rootDir>/jest.setup.ts'],
    collectCoverage: true,
    collectCoverageFrom: [
        '**/*.{ts,tsx,js,jsx}',
        '!**/coverage/**',
        '!**/node_modules/**',
        '!**/babel.config.js',
        '!**/expo-env.d.ts',
        '!**/.expo/**',
        '!android/app/build/**'
    ],
    moduleNameMapper: {
        // В tsconfig настроены два алиаса: '@/*' -> src и '@/assets/*' -> assets
        '^@/assets/(.*)$': '<rootDir>/assets/$1',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^.+\\.(png|jpg|jpeg|gif|svg|ttf|otf)$': '<rootDir>/__mocks__/fileMock.ts'
    },
    transformIgnorePatterns: [
        // Добавляем "uuid" (ESM) в allowlist, иначе Jest падает на синтаксисе "export" при интеграционном тесте AvatarUploader
        'node_modules/(?!(jest-)?react-native|@react-native|@react-native-async-storage|@react-navigation|react-clone-referenced-element|@react-native-community|@expo|expo(nent)?|@expo-google-fonts|expo-font|expo-asset|expo-router|uuid)'
    ]
};
