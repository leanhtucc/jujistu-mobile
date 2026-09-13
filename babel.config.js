const supportedEnvironments = ['development', 'staging', 'production'];

module.exports = api => {
  const environment = process.env.JUJISTU_ENV ?? 'development';

  if (!supportedEnvironments.includes(environment)) {
    throw new Error(
      `Invalid JUJISTU_ENV "${environment}". Expected one of: ${supportedEnvironments.join(
        ', ',
      )}.`,
    );
  }

  api.cache.using(() => environment);

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      ['./scripts/babel-plugin-inline-jujistu-environment.js', { environment }],
    ],
  };
};
