import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import js from '@eslint/js';

import tseslint from 'typescript-eslint';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
    {
        ignores: ['**/dist/**', '**/coverage/**']
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts', '**/*.js'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                tsconfigRootDir: __dirname,
                projectService: true
            },
            globals: {
                process: 'readonly',
                console: 'readonly',
                Buffer: 'readonly'
            }
        },
        plugins: {
            '@typescript-eslint': typescriptPlugin
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
