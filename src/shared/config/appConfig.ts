export const APP_ENVIRONMENTS = [
  'development',
  'staging',
  'production',
] as const;

export type AppEnvironment = (typeof APP_ENVIRONMENTS)[number];

export type AppConfig = Readonly<{
  apiBaseUrl: string | null;
  enableDebugLogging: boolean;
  environment: AppEnvironment;
}>;

type EnvironmentSettings = Omit<AppConfig, 'environment'>;

declare const process: {
  readonly env: {
    readonly JUJISTU_ENV?: string;
  };
};

const settings: Record<AppEnvironment, EnvironmentSettings> = {
  development: {
    apiBaseUrl: null,
    enableDebugLogging: true,
  },
  staging: {
    apiBaseUrl: null,
    enableDebugLogging: true,
  },
  production: {
    apiBaseUrl: null,
    enableDebugLogging: false,
  },
};

export function parseAppEnvironment(value: string | undefined): AppEnvironment {
  switch (value) {
    case 'development':
    case 'staging':
    case 'production':
      return value;
  }

  throw new Error(
    `Invalid JUJISTU_ENV "${String(
      value,
    )}". Expected one of: ${APP_ENVIRONMENTS.join(', ')}.`,
  );
}

export function createAppConfig(
  environment: AppEnvironment,
  environmentSettings: EnvironmentSettings,
): AppConfig {
  const apiBaseUrl = validateApiBaseUrl(
    environment,
    environmentSettings.apiBaseUrl,
  );

  return Object.freeze({
    ...environmentSettings,
    apiBaseUrl,
    environment,
  });
}

function validateApiBaseUrl(
  environment: AppEnvironment,
  value: string | null,
): string | null {
  if (value === null) {
    return null;
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid API base URL for ${environment}.`);
  }

  const isLocalDevelopmentUrl =
    environment === 'development' &&
    ['localhost', '127.0.0.1', '10.0.2.2'].includes(url.hostname);

  if (url.protocol !== 'https:' && !isLocalDevelopmentUrl) {
    throw new Error(`API base URL for ${environment} must use HTTPS.`);
  }

  return value.replace(/\/+$/, '');
}

const environment = parseAppEnvironment(process.env.JUJISTU_ENV);

export const appConfig = createAppConfig(environment, settings[environment]);
