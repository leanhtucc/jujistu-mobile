const supportedEnvironments = ['development', 'staging', 'production'];

module.exports = api => {
  const isTest = api.env('test');
  const environment = process.env.JUJISTU_ENV ?? 'development';

  if (!supportedEnvironments.includes(environment)) {
    throw new Error(
      `Invalid JUJISTU_ENV "${environment}". Expected one of: ${supportedEnvironments.join(
        ', ',
      )}.`,
    );
  }

  api.cache.using(() => `${environment}-${isTest ? 'test' : 'app'}`);

  return {
    presets: [
      [
        'module:@react-native/babel-preset',
        isTest ? {} : { jsxImportSource: 'nativewind' },
      ],
      ...(isTest ? [] : ['nativewind/babel']),
    ],
    plugins: [
      ['./scripts/babel-plugin-inline-jujistu-environment.js', { environment }],
    ],
  };
};
