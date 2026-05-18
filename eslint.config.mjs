// ESLint flat config for ESLint v9
// Uses FlatCompat to load existing shareable configs like airbnb-base
import globals from 'globals';
import pluginImport from 'eslint-plugin-import-x';
import pluginN from 'eslint-plugin-n';
import pluginPromise from 'eslint-plugin-promise';

export default [
  // Global ignores
  {
    ignores: ['node_modules/**', 'test-results/**', 'eslint.config.*', 'vitest.config.*'],
  },
  // Plugin recommended configs
  pluginImport.flatConfigs.recommended,
  pluginN.configs['flat/recommended'],
  pluginPromise.configs['flat/recommended'],
  // Environments and parser options (after plugins so ecmaVersion wins)
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs', // CommonJS project
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
    },
  },
  // ESM files
  {
    files: ['**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
  // Project-specific rules that were in .eslintrc.js
  {
    rules: {
      'no-param-reassign': ['error', { props: false }],
    },
  },
  // Test file overrides
  {
    files: ['test/**'],
    rules: {
      'n/no-unpublished-require': 'off',
      'n/no-unpublished-import': 'off',
    },
  },
];
