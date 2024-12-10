import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      indent: ['error', 2],
      semi: ['warn', 'always'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': 'error',
      quotes: ['error', 'single'],
    },
  },
  {
    ignores: ['config/*', 'services/*'],
  },
];
