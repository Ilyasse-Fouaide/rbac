import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import prettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      prettier: prettier,
    },
  },
  {
    rules: {
      indent: ['error', 2],
      semi: ['warn', 'always'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': 'error',
      quotes: ['error', 'single'],
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          caughtErrors: 'all',
          ignoreRestSiblings: false,
          reportUsedIgnorePattern: false,
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    ignores: ['config/*', 'services/*'],
  },
];
