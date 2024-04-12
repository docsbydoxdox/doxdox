import js from '@eslint/js';

import tseslint from 'typescript-eslint';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

export default [
    js.configs.recommended,
    tseslint.configs.eslintRecommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts', '**/*.js'],
        languageOptions: {
            parser: typescriptParser,
            globals: {
                Buffer: 'readonly'
            }
        },
        plugins: {
            typescriptPlugin: typescriptPlugin
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': 'error',
            'no-warning-comments': [
                'warn',
                { terms: ['todo'], location: 'start' }
            ],
            'no-magic-numbers': [
                'error',
                {
                    ignore: [-1, 0, 1]
                }
            ]
        }
    }
];
