import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactNative from 'eslint-plugin-react-native';
import { defineConfig } from 'eslint/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default defineConfig([
	{
		extends: compat.extends(
			'eslint:recommended',
			'plugin:@typescript-eslint/recommended',
		),

		plugins: {
			prettier,
			react,
			'react-native': reactNative,
		},

		rules: {
			'react-native/no-unused-styles': 2,
			'react-native/split-platform-components': 2,
			'react-native/no-inline-styles': 2,
			'react-native/no-color-literals': 2,
			'react-native/no-raw-text': [2, { skip: ['AppText'] }],
			'react-native/no-single-element-style-arrays': 2,
			'react-hooks/exhaustive-deps': 'off',
			'@typescript-eslint/no-empty-function': ['off'],
			'@typescript-eslint/interface-name-prefix': 'off',
			'@typescript-eslint/ban-types': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: 'react-native',
							importNames: ['Text', 'TextInput'],
							message:
								'Use AppText and AppTextInput from @/shared/ui instead',
						},
					],
					patterns: [
						{
							group: ['../assets/fonts/*'],
							message:
								'User require() for fonts assets instead of import',
						},
					],
				},
			],
			'@typescript-eslint/no-require-imports': [
				'error',
				{
					allow: [
						'\\.otf$', // разрешаем .otf файлы
						'\\.ttf$', // разрешаем .ttf файлы
						'\\.woff$', // разрешаем .woff файлы
						'\\.woff2$', // разрешаем .woff2 файлы
					],
				},
			],
		},
	},
]);
