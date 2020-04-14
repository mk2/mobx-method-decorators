module.exports = {
  root: true,
  ignorePatterns: ['node_modules/', 'lib/'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['jest', 'simple-import-sort'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  env: {
    'jest/globals': true,
    node: true,
    es6: true,
  },
  overrides: [
    {
      files: ['**/*.ts'],
      extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint'],
      rules: {
        'simple-import-sort/sort': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
        '@typescript-eslint/no-var-requires': 'warn',
        '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
        '@typescript-eslint/ban-ts-ignore': 'warn',
      },
    },
  ],
};
