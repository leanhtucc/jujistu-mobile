import {
  createAppConfig,
  parseAppEnvironment,
} from '@jujistu/shared/config/appConfig';

describe('appConfig', () => {
  it.each(['development', 'staging', 'production'] as const)(
    'accepts the %s environment',
    environment => {
      expect(parseAppEnvironment(environment)).toBe(environment);
    },
  );

  it('rejects an unknown environment', () => {
    expect(() => parseAppEnvironment('preview')).toThrow('Invalid JUJISTU_ENV');
  });

  it('normalizes a valid HTTPS API base URL', () => {
    const config = createAppConfig('production', {
      apiBaseUrl: 'https://api.example.com/',
      enableDebugLogging: false,
    });

    expect(config.apiBaseUrl).toBe('https://api.example.com');
  });

  it('rejects insecure non-local API URLs', () => {
    expect(() =>
      createAppConfig('staging', {
        apiBaseUrl: 'http://api.example.com',
        enableDebugLogging: true,
      }),
    ).toThrow('must use HTTPS');
  });

  it('allows an HTTP Android emulator URL during development', () => {
    const config = createAppConfig('development', {
      apiBaseUrl: 'http://10.0.2.2:3000/',
      enableDebugLogging: true,
    });

    expect(config.apiBaseUrl).toBe('http://10.0.2.2:3000');
  });
});
