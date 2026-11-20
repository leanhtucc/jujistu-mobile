module.exports = {
  root: true,
  extends: '@react-native',
  ignorePatterns: ['.tmp/**', 'scratch/**', '.agents/**'],
  overrides: [
    {
      // Comment standard (CONTRIBUTING.md > "Code comments"): exported hooks,
      // services and components must carry a JSDoc block. Error level: the
      // existing code is documented.
      files: [
        'src/features/**/{hooks,services,screens,components}/*.{ts,tsx}',
        'src/shared/**/*.{ts,tsx}',
      ],
      excludedFiles: ['**/glyphs/**', '**/*.types.ts'],
      plugins: ['jsdoc'],
      rules: {
        'jsdoc/require-jsdoc': [
          'error',
          {
            publicOnly: true,
            require: {
              FunctionDeclaration: true,
              ArrowFunctionExpression: false,
            },
          },
        ],
      },
    },
  ],
};
