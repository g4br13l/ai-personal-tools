import stylistic from '@stylistic/eslint-plugin'
import importLite from 'eslint-plugin-import-lite'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'



export const reactEslintConfig = (tsconfigRootDir: string) => defineConfig([

  stylistic.configs.recommended,
  tseslint.configs.recommended,
  importLite.configs.recommended,

  {
    ignores: [
      'node_modules/**',
      '**/dist/**',
      '.dist/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      '**/.tanstack/**',
      '.tanstack/**',
      '**/.output/**',
      '.output',
      '**/.vercel/**',
      '.vercel',
      'vite.config.js',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: tsconfigRootDir,
      },
    },
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'node/prefer-node-protocol': 'off',
      '@stylistic/indent': ['warn', 2],
      '@stylistic/quotes': ['warn', 'single', {
        avoidEscape: true,
        allowTemplateLiterals: 'always',
      }],
      '@stylistic/padded-blocks': ['off'],
      '@stylistic/comma-dangle': ['warn', 'always-multiline'],
      '@stylistic/jsx-quotes': ['warn', 'prefer-double'],
      '@stylistic/comma-spacing': ['warn', { before: false, after: true }],
      '@stylistic/max-len': ['warn', { code: 100, ignoreStrings: true, ignoreComments: true }],
      '@stylistic/no-multiple-empty-lines': ['warn', { max: 3 }],
      'import-lite/newline-after-import': ['warn', { count: 3 }],
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/arrow-parens': ['warn', 'always'],
      '@stylistic/jsx-one-expression-per-line': ['warn', { allow: 'single-line' }],
      '@stylistic/no-trailing-spaces': ['off'],
      // '@stylistic/jsx-closing-bracket-location':
      //   ['warn', { selfClosing: 'props-aligned', nonEmpty: 'after-props' }],
      // ['warn', 'line-aligned'],

      // Enforce one property/element per line in multiline objects/arrays
      '@stylistic/object-property-newline': ['warn', { allowAllPropertiesOnSameLine: true }],
      /* '@stylistic/object-pattern-newline': ['warn', { allowAllPropertiesOnSameLine: true }], */
      '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
      '@stylistic/array-element-newline': ['warn', 'consistent'],
      '@stylistic/linebreak-style': ['error', 'unix'],

      '@stylistic/operator-linebreak': ['warn', 'after', {
        overrides: {
          '?': 'before',
          ':': 'before',
          '|': 'before',
        },
      }],
      '@typescript-eslint/array-type': ['off'],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
      }],
      '@typescript-eslint/no-restricted-imports': ['error', {
        patterns: [
          {
            group: [
              'packages/*/src/**',
              '**/packages/*/src/**',
              '@repo/*/src/**',
            ],
            message: 'Import from public package entrypoints (for example @repo/core/all).',
          },
        ],
      }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/naming-convention': ['warn',
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          suffix: ['I'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
          suffix: ['T'],
        },
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          prefix: ['T'],
        }],
    },
  },
])

export default reactEslintConfig(import.meta.dirname)
