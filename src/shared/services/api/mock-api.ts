import { AUTH_API_PATHS, SYSTEM_API_PATHS } from './paths';
import type {
  ApiEnvelope,
  AuthTokenDataApi,
  UserProfileDataApi,
} from './schema';
import type { ApiRequestOptions } from './types';

const MOCK_ACCESS_TOKEN = 'jujistu-mock-access-token';
const MOCK_REFRESH_TOKEN = 'jujistu-mock-refresh-token';

function waitForMockLatency(ms = 120): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ok<TData>(message: string, data?: TData): ApiEnvelope<TData> {
  return {
    data,
    message,
    status: 200,
    success: true,
  };
}

const MOCK_USER: UserProfileDataApi = {
  id: 'usr_jujistu_mock_1',
  email: 'athlete@jujistu.app',
  displayName: 'Jujitsu Athlete',
  avatarUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const MOCK_TOKENS: AuthTokenDataApi = {
  access_token: MOCK_ACCESS_TOKEN,
  refresh_token: MOCK_REFRESH_TOKEN,
  expire_in: 3600,
  auth_type: 'Bearer',
};

export function hasMockApiResponse(path: string): boolean {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  switch (normalizedPath) {
    case AUTH_API_PATHS.login:
    case AUTH_API_PATHS.register:
    case AUTH_API_PATHS.refreshToken:
    case AUTH_API_PATHS.me:
    case AUTH_API_PATHS.logout:
    case SYSTEM_API_PATHS.appVersion:
      return true;
    default:
      return false;
  }
}

export async function mockApiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  await waitForMockLatency();

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  switch (normalizedPath) {
    case AUTH_API_PATHS.login: {
      const body = options.body as { email?: string } | undefined;
      return ok('Login successful', {
        ...MOCK_TOKENS,
        user: {
          ...MOCK_USER,
          email: body?.email || MOCK_USER.email,
        },
      }) as unknown as TResponse;
    }

    case AUTH_API_PATHS.register: {
      const body = options.body as
        | { email?: string; displayName?: string }
        | undefined;
      return ok('Registration successful', {
        ...MOCK_TOKENS,
        user: {
          ...MOCK_USER,
          email: body?.email || MOCK_USER.email,
          displayName: body?.displayName || MOCK_USER.displayName,
        },
      }) as unknown as TResponse;
    }

    case AUTH_API_PATHS.refreshToken:
      return ok('Tokens refreshed', MOCK_TOKENS) as unknown as TResponse;

    case AUTH_API_PATHS.me:
      return ok('Profile retrieved', MOCK_USER) as unknown as TResponse;

    case AUTH_API_PATHS.logout:
      return ok('Logged out successfully', null) as unknown as TResponse;

    case SYSTEM_API_PATHS.appVersion:
      return ok('System version', {
        minVersion: '0.0.1',
        latestVersion: '0.0.1',
        updateUrl: null,
      }) as unknown as TResponse;

    default:
      throw new Error(`No mock handler configured for path: ${path}`);
  }
}
