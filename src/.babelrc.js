module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: true,
        },
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-numeric-separator',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/proposal-object-rest-spread',
  ],
};
